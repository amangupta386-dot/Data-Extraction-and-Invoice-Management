const app = require("./src/app");
const { PORT } = require("./src/config/env");

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



// const express = require("express");
// const cors = require("cors"); // Import cors
// const multer = require("multer");
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const { GoogleAIFileManager } = require("@google/generative-ai/server");
// const XLSX = require("xlsx");


// require("dotenv").config();

// const app = express();
// const upload = multer({ dest: "uploads/" });
// app.use(cors()); // Enable CORS for all origins


// const genAI = new GoogleGenerativeAI(process.env.API_KEY);
// const fileManager = new GoogleAIFileManager(process.env.API_KEY);

// // mime Type pdf 

// app.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     const filePath = req.file.path;
//     const fileName = req.file.originalname;

//     if (req.file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
//       const workbook = XLSX.readFile(filePath);
//       const sheetNames = workbook.SheetNames;
//       let summary = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
//       const extractedText = JSON.stringify(summary, null, 2);
    
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
//       // Define a clear, structured prompt
//       const prompt = `
//       The following JSON data contains invoice information. Process it and return in the specified format:
      
//       Data: 
//       ${extractedText}
    
//       Desired Format:
//       This data represents a summary of invoices. Here's a breakdown of the information and some observations:
    
//       **Key Fields:**
//       - Serial Number
//       - Invoice Date
//       - Item Total Amount
//       - Product Name
//       - Qty
//       - Price with Tax
//       - Unit
//       - Tax (%)
//       - Party Name
//       - Phone Number
//       - Party Company Name
//       - Status
    
//       Observations and suggested improvements should also be included. Structure your response precisely and clearly.
//       `;
    
//       try {
//         const result = await model.generateContent([{ text: prompt }]);
//         const rawSummary = result.response.candidates[0].content.parts[0].text;
      
//         // Parse and validate response
//         const parsedData = parseInvoiceData(rawSummary);
    
//         if (parsedData) {
//           return res.send({ summary: parsedData });
//         } else {
//           return res.status(400).send({ error: "Response parsing failed or invalid format." });
//         }
//       } catch (error) {
//         console.error("Error generating or processing content:", error);
//         return res.status(500).send({ error: "Internal server error." });
//       }
//     }
    

//     // Handle other MIME types as before
//     const uploadResponse = await fileManager.uploadFile(filePath, {
//       mimeType: req.file.mimetype,
//       displayName: fileName,
//     });

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const result = await model.generateContent([
//       {
//         fileData: {
//           mimeType: uploadResponse.file.mimeType,
//           fileUri: uploadResponse.file.uri,
//         },
//       },
//       { text: "Can you summarize this document as a bulleted list?" },
//     ]);

//     const rawSummary = result.response.candidates[0].content.parts[0].text;
//     console.log(rawSummary, "raw summary");

//     if (req.file.mimetype === "application/pdf") {
//       const structuredSummary = {
//         invoiceDetails: extractSection(rawSummary, "Invoice Details"),
//         additionalCharges: extractSection(rawSummary, "Additional Charges"),
//         taxes: extractSection(rawSummary, "Taxes"),
//         termsAndConditions: extractSection(rawSummary, "Terms and Conditions"),
//         importantNote: extractImportantNote(rawSummary),
//       };

//       // structuredSummary.invoiceDetails = extractKeyValuePairs(rawSummary, "Invoice Details");

//       return res.send({ summary: structuredSummary });
//     } else if (req.file.mimetype === "image/jpeg") {
//       const summary = parseSummary(rawSummary);
//       return res.send({ summary });
//     }
//   } catch (error) {
//     console.error("Error processing file:", error);
//     res.status(500).send({ error: "Failed to process the file." });
//   }
// });




// function parseInvoiceData(input) {
//   console.log(input, "raw input")
//   const lines = input.split("\n");
//   console.log("Lines from Input:", lines);

//   // Find the start and end of the JSON block
//   const jsonStartIndex = lines.findIndex(line => line.includes('```json'));
//   const jsonEndIndex = lines.slice(jsonStartIndex + 1).findIndex(line => line.includes('```')) + jsonStartIndex + 1;

//   if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
//     // Extract JSON block and clean it
//     let jsonBlock = lines.slice(jsonStartIndex + 1, jsonEndIndex).join('\n')
//       .replace(/\/\/.*/g, '') // Remove comments
//       .replace(/\\n/g, '') // Remove escaped newlines
//       .replace(/\\/g, '') // Remove backslashes
//       .replace(/,\s*[}\]]/g, match => match.trim().slice(1)) // Remove trailing commas before closing brackets
//       .replace(/\s*\[\s*\{/g, '[{') // Fix misplaced brackets
//       .replace(/\}\s*\]/g, '}]') // Fix misplaced brackets
//       .replace(/\}\s*,\s*\{/g, '},{'); // Properly separate objects within arrays

//     console.log("Cleaned JSON Block:", jsonBlock);

//     try {
//       // Attempt to parse the cleaned JSON
//       const parsedJson = JSON.parse(jsonBlock);
//       console.log("Parsed JSON Object:", parsedJson);
//       return parsedJson;
//     } catch (error) {
//       console.error("Error parsing JSON block:", error.message);
//       return null;
//     }
//   } else {
//     console.error("JSON block not found in input.");
//     return null;
//   }
// }


// const parseSummary = (rawText) => {
//   console.log("Raw Text Input:", rawText);

//   // Split and clean lines
//   const lines = rawText.split("\n").filter((line) => line.trim() !== "");
//   console.log("Parsed Lines:", lines);

//   const summary = {
//     store: "",
//     location: "",
//     gstin: "",
//     mobile: "",
//     customerName: "",
//     billNo: "",
//     date: "",
//     itemsPurchased: [],
//     igst: "",
//     totalAmount: "",
//   };

//   let parsingItems = false;

//   lines.forEach((line) => {
//     // Clean line by removing bullet points and extra symbols
//     line = line.startsWith("* **") ? line.replace(/\*\*|\*/g, "").trim() : line;

//     if (line.startsWith("Retailer:") || line.startsWith("Seller:") || line.startsWith("Business:") || line.startsWith("Shop:") || line.startsWith("Store:")) {
//       summary.store = line.split(":")[1]?.trim() || "";
//     } else if (line.startsWith("Address:") || line.startsWith("Location:")) {
//       summary.location = line.split(":")[1]?.trim() || "";
//     } else if (line.startsWith("GSTIN:")) {
//       summary.gstin = line.split(":")[1]?.trim() || "";
//     } else if (line.startsWith("Mobile:")) {
//       summary.mobile = line.split(":")[1]?.trim() || "";
//     } else if (line.startsWith("Customer Name:")) {
//       summary.customerName = line.split(":")[1]?.trim() || "";
//     } else if (line.startsWith("Bill No:") || line.startsWith("Bill No.:") || line.startsWith("Bill Number")) {
//       summary.billNo = line.split(":")[1]?.trim() || "";
//     } else if (line.startsWith("Date:")) {
//       summary.date = line.split(":")[1]?.trim() || "";
//     } else if (line.startsWith("Items Purchased:")) {
//       parsingItems = true;
//       console.log("Started Parsing Items");
//     }
//     else if (parsingItems && line.trim("").startsWith("*")) {
//       // Regex updated to handle the structure in lines 9-11
//       line = line.replace(/\*\*|\*/g, "").trim();
//       let productNameMatch = line.match(/^(.*?)(?:\s\(\d+ unit\))/) || line.match(/^(.*?)(?:\s\(| - )/);
//       const productName = productNameMatch ? productNameMatch[1].trim() : null;

//       // Extract quantity
//       let quantityMatch = line.match(/\((\d+) unit\)/) || line.match(/(?:Quantity: )?(\d+) (?:unit|\))/);
//       const quantity = quantityMatch ? parseInt(quantityMatch[1], 10) : null;

//       // Extract price
//       let priceMatch = line.match(/₹([\d,.]+)/) || line.match(/Original Price:\s*₹([\d,.]+)/);
//       const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : null;

//       // Extract discount
//       let discountMatch = line.match(/(\d+)% discount/) || line.match(/(?:Discounted Price|₹):\s*₹([\d,.]+)/);
//       const discount = discountMatch ? parseInt(discountMatch[1], 10) : null;

//       summary.itemsPurchased.push({
//         itemName: productName,
//         quantity: quantity,
//         price: price,
//         discountedPrice: `${discount}%`,
//       });

//     } else if (line.startsWith("IGST")) {
//       summary.igst = line.split(":")[1]?.trim() || "";
//     } else if (line.startsWith("Total Amount:")) {
//       summary.totalAmount = line.split(":")[1]?.trim() || "";
//     } else {
//       parsingItems = false; // Stop parsing items
//     }
//   });

//   console.log("Final Parsed Summary:", summary);
//   return summary;
// };










// // Helper function to extract sections
// function extractSection(text, sectionTitle) {
//   const regex = new RegExp(
//     `\\*\\*${sectionTitle}:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\*\\*|$)`,
//     "i"
//   );
//   const match = text.match(regex);
//   if (match) {
//     return match[1]
//       .split("\n") // Split by line breaks
//       .map((item) => item.replace(/^\* ?/, "").trim()) // Clean bullet points
//       .filter((item) => item.length > 0); // Remove empty lines
//   }
//   return [];
// }

// function extractKeyValuePairs(text, sectionTitle) {
//   const regex = new RegExp(
//     `\\*\\*${sectionTitle}:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\*\\*|$)`,
//     "i"
//   );
//   const match = text.match(regex);
//   if (match) {
//     const lines = match[1]
//       .split("\n")
//       .map((line) => line.replace(/^\* ?/, "").trim())
//       .filter((line) => line.length > 0);

//     const keyValuePairs = {};
//     lines.forEach((line) => {
//       const [key, value] = line.split(/:\s*/);
//       if (key && value) {
//         keyValuePairs[key.trim()] = value.trim();
//       }
//     });
//     return keyValuePairs;
//   }
//   return {};
// }

// function extractImportantNote(text) {
//   const regex = /\*\*Additional Notes:\*\*\s*([\s\S]*?)(?=\n$|$)/i;
//   const match = text.match(regex);
//   return match ? match[1].trim() : null;
// }



// app.listen(5000, () => console.log("Server running on port 5000"));