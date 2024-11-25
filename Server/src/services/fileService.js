const { genAI, fileManager } = require("../config/genAI");
const { parseInvoiceData, parseSummary } = require("../utils/parseHelpers");
const { extractSection } = require("../utils/extractHelpers");
const XLSX = require("xlsx");

exports.processFile = async (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetNames = workbook.SheetNames;
  const summary = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
  const extractedText = JSON.stringify(summary, null, 2);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `
  Process this JSON data into structured invoice details:

  Data:
  ${extractedText}

  Format:
  ...
  `;

  const result = await model.generateContent([{ text: prompt }]);
  return parseInvoiceData(result.response.candidates[0].content.parts[0].text);
};

exports.parseAndSummarize = async (filePath, fileName, mimeType) => {
  const uploadResponse = await fileManager.uploadFile(filePath, {
    mimeType,
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
    { text: "Summarize this document." },
  ]);

  return parseSummary(result.response.candidates[0].content.parts[0].text);
};
