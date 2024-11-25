const { parseInvoiceData, parseSummary, extractSection, extractImportantNote } = require("../utils/parser");
const { genAI, fileManager } = require("../config/config");

exports.uploadFile = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = req.file.originalname;

    if (req.file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      const XLSX = require("xlsx");
      const workbook = XLSX.readFile(filePath);
      const sheetNames = workbook.SheetNames;
      let summary = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
      const extractedText = JSON.stringify(summary, null, 2);

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        The following JSON data contains invoice information. Process it and return in the specified format:
        
        Data: 
        ${extractedText}
        
        Desired Format:
        This data represents a summary of invoices. Here's a breakdown of the information and some observations:
        
        **Key Fields:**
        - Serial Number
        - Invoice Date
        - Item Total Amount
        - Product Name
        - Qty
        - Price with Tax
        - Unit
        - Tax (%)
        - Party Name
        - Phone Number
        - Party Company Name
        - Status
        
        Observations and suggested improvements should also be included. Structure your response precisely and clearly.
      `;

      try {
        const result = await model.generateContent([{ text: prompt }]);
        const rawSummary = result.response.candidates[0].content.parts[0].text;
        const parsedData = parseInvoiceData(rawSummary);

        if (parsedData) {
          return res.send({ summary: parsedData });
        } else {
          return res.status(400).send({ error: "Response parsing failed or invalid format." });
        }
      } catch (error) {
        console.error("Error generating or processing content:", error);
        return res.status(500).send({ error: "Internal server error." });
      }
    }

    const uploadResponse = await fileManager.uploadFile(filePath, {
      mimeType: req.file.mimetype,
      displayName: fileName,
    });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      { text: "Can you summarize this document as a bulleted list?" },
    ]);

    const rawSummary = result.response.candidates[0].content.parts[0].text;

    if (req.file.mimetype === "application/pdf") {
      const structuredSummary = {
        invoiceDetails: extractSection(rawSummary, "Invoice Details"),
        additionalCharges: extractSection(rawSummary, "Additional Charges"),
        taxes: extractSection(rawSummary, "Taxes"),
        termsAndConditions: extractSection(rawSummary, "Terms and Conditions"),
        importantNote: extractImportantNote(rawSummary),
      };

      return res.send({ summary: structuredSummary });
    } else if (req.file.mimetype === "image/jpeg") {
      const summary = parseSummary(rawSummary);
      return res.send({ summary });
    }
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).send({ error: "Failed to process the file." });
  }
};
