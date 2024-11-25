"use strict";

function parseInvoiceData(input) {
  console.log(input, "raw input");
  var lines = input.split("\n");
  console.log("Lines from Input:", lines);

  // Find the start and end of the JSON block
  var jsonStartIndex = lines.findIndex(function (line) {
    return line.includes('```json');
  });
  var jsonEndIndex = lines.slice(jsonStartIndex + 1).findIndex(function (line) {
    return line.includes('```');
  }) + jsonStartIndex + 1;
  if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
    // Extract JSON block and clean it
    var jsonBlock = lines.slice(jsonStartIndex + 1, jsonEndIndex).join('\n').replace(/\/\/.*/g, '') // Remove comments
    .replace(/\\n/g, '') // Remove escaped newlines
    .replace(/\\/g, '') // Remove backslashes
    .replace(/,\s*[}\]]/g, function (match) {
      return match.trim().slice(1);
    }) // Remove trailing commas before closing brackets
    .replace(/\s*\[\s*\{/g, '[{') // Fix misplaced brackets
    .replace(/\}\s*\]/g, '}]') // Fix misplaced brackets
    .replace(/\}\s*,\s*\{/g, '},{'); // Properly separate objects within arrays

    console.log("Cleaned JSON Block:", jsonBlock);
    try {
      // Attempt to parse the cleaned JSON
      var parsedJson = JSON.parse(jsonBlock);
      console.log("Parsed JSON Object:", parsedJson);
      return parsedJson;
    } catch (error) {
      console.error("Error parsing JSON block:", error.message);
      return null;
    }
  } else {
    console.error("JSON block not found in input.");
    return null;
  }
}
var parseSummary = function parseSummary(rawText) {
  console.log("Raw Text Input:", rawText);

  // Split and clean lines
  var lines = rawText.split("\n").filter(function (line) {
    return line.trim() !== "";
  });
  console.log("Parsed Lines:", lines);
  var summary = {
    store: "",
    location: "",
    gstin: "",
    mobile: "",
    customerName: "",
    billNo: "",
    date: "",
    itemsPurchased: [],
    igst: "",
    totalAmount: ""
  };
  var parsingItems = false;
  lines.forEach(function (line) {
    // Clean line by removing bullet points and extra symbols
    line = line.startsWith("* **") ? line.replace(/\*\*|\*/g, "").trim() : line;
    if (line.startsWith("Retailer:") || line.startsWith("Seller:") || line.startsWith("Business:") || line.startsWith("Shop:") || line.startsWith("Store:")) {
      var _line$split$;
      summary.store = ((_line$split$ = line.split(":")[1]) === null || _line$split$ === void 0 ? void 0 : _line$split$.trim()) || "";
    } else if (line.startsWith("Address:") || line.startsWith("Location:")) {
      var _line$split$2;
      summary.location = ((_line$split$2 = line.split(":")[1]) === null || _line$split$2 === void 0 ? void 0 : _line$split$2.trim()) || "";
    } else if (line.startsWith("GSTIN:")) {
      var _line$split$3;
      summary.gstin = ((_line$split$3 = line.split(":")[1]) === null || _line$split$3 === void 0 ? void 0 : _line$split$3.trim()) || "";
    } else if (line.startsWith("Mobile:")) {
      var _line$split$4;
      summary.mobile = ((_line$split$4 = line.split(":")[1]) === null || _line$split$4 === void 0 ? void 0 : _line$split$4.trim()) || "";
    } else if (line.startsWith("Customer Name:")) {
      var _line$split$5;
      summary.customerName = ((_line$split$5 = line.split(":")[1]) === null || _line$split$5 === void 0 ? void 0 : _line$split$5.trim()) || "";
    } else if (line.startsWith("Bill No:") || line.startsWith("Bill No.:") || line.startsWith("Bill Number")) {
      var _line$split$6;
      summary.billNo = ((_line$split$6 = line.split(":")[1]) === null || _line$split$6 === void 0 ? void 0 : _line$split$6.trim()) || "";
    } else if (line.startsWith("Date:")) {
      var _line$split$7;
      summary.date = ((_line$split$7 = line.split(":")[1]) === null || _line$split$7 === void 0 ? void 0 : _line$split$7.trim()) || "";
    } else if (line.startsWith("Items Purchased:")) {
      parsingItems = true;
      console.log("Started Parsing Items");
    } else if (parsingItems && line.trim("").startsWith("*")) {
      // Regex updated to handle the structure in lines 9-11
      line = line.replace(/\*\*|\*/g, "").trim();
      var productNameMatch = line.match(/^(.*?)(?:\s\(\d+ unit\))/) || line.match(/^(.*?)(?:\s\(| - )/);
      var productName = productNameMatch ? productNameMatch[1].trim() : null;

      // Extract quantity
      var quantityMatch = line.match(/\((\d+) unit\)/) || line.match(/(?:Quantity: )?(\d+) (?:unit|\))/);
      var quantity = quantityMatch ? parseInt(quantityMatch[1], 10) : null;

      // Extract price
      var priceMatch = line.match(/₹([\d,.]+)/) || line.match(/Original Price:\s*₹([\d,.]+)/);
      var price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : null;

      // Extract discount
      var discountMatch = line.match(/(\d+)% discount/) || line.match(/(?:Discounted Price|₹):\s*₹([\d,.]+)/);
      var discount = discountMatch ? parseInt(discountMatch[1], 10) : null;
      summary.itemsPurchased.push({
        itemName: productName,
        quantity: quantity,
        price: price,
        discountedPrice: "".concat(discount, "%")
      });
    } else if (line.startsWith("IGST")) {
      var _line$split$8;
      summary.igst = ((_line$split$8 = line.split(":")[1]) === null || _line$split$8 === void 0 ? void 0 : _line$split$8.trim()) || "";
    } else if (line.startsWith("Total Amount:")) {
      var _line$split$9;
      summary.totalAmount = ((_line$split$9 = line.split(":")[1]) === null || _line$split$9 === void 0 ? void 0 : _line$split$9.trim()) || "";
    } else {
      parsingItems = false; // Stop parsing items
    }
  });
  console.log("Final Parsed Summary:", summary);
  return summary;
};

// Helper function to extract sections
function extractSection(text, sectionTitle) {
  var regex = new RegExp("\\*\\*".concat(sectionTitle, ":\\*\\*\\s*([\\s\\S]*?)(?=\\n\\*\\*|$)"), "i");
  var match = text.match(regex);
  if (match) {
    return match[1].split("\n") // Split by line breaks
    .map(function (item) {
      return item.replace(/^\* ?/, "").trim();
    }) // Clean bullet points
    .filter(function (item) {
      return item.length > 0;
    }); // Remove empty lines
  }
  return [];
}
function extractImportantNote(text) {
  var regex = /\*\*Additional Notes:\*\*\s*([\s\S]*?)(?=\n$|$)/i;
  var match = text.match(regex);
  return match ? match[1].trim() : null;
}
module.exports = {
  parseInvoiceData: parseInvoiceData,
  parseSummary: parseSummary,
  extractSection: extractSection,
  extractImportantNote: extractImportantNote
};