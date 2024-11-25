
function parseInvoiceData(input) {
  console.log(input, "raw input")
  const lines = input.split("\n");
  console.log("Lines from Input:", lines);

  // Find the start and end of the JSON block
  const jsonStartIndex = lines.findIndex(line => line.includes('```json'));
  const jsonEndIndex = lines.slice(jsonStartIndex + 1).findIndex(line => line.includes('```')) + jsonStartIndex + 1;

  if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
    // Extract JSON block and clean it
    let jsonBlock = lines.slice(jsonStartIndex + 1, jsonEndIndex).join('\n')
      .replace(/\/\/.*/g, '') // Remove comments
      .replace(/\\n/g, '') // Remove escaped newlines
      .replace(/\\/g, '') // Remove backslashes
      .replace(/,\s*[}\]]/g, match => match.trim().slice(1)) // Remove trailing commas before closing brackets
      .replace(/\s*\[\s*\{/g, '[{') // Fix misplaced brackets
      .replace(/\}\s*\]/g, '}]') // Fix misplaced brackets
      .replace(/\}\s*,\s*\{/g, '},{'); // Properly separate objects within arrays

    console.log("Cleaned JSON Block:", jsonBlock);

    try {
      // Attempt to parse the cleaned JSON
      const parsedJson = JSON.parse(jsonBlock);
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


const parseSummary = (rawText) => {
  console.log("Raw Text Input:", rawText);

  // Split and clean lines
  const lines = rawText.split("\n").filter((line) => line.trim() !== "");
  console.log("Parsed Lines:", lines);

  const summary = {
    store: "",
    location: "",
    gstin: "",
    mobile: "",
    customerName: "",
    billNo: "",
    date: "",
    itemsPurchased: [],
    igst: "",
    totalAmount: "",
  };

  let parsingItems = false;

  lines.forEach((line) => {
    // Clean line by removing bullet points and extra symbols
    line = line.startsWith("* **") ? line.replace(/\*\*|\*/g, "").trim() : line;

    if (line.startsWith("Retailer:") || line.startsWith("Seller:") || line.startsWith("Business:") || line.startsWith("Shop:") || line.startsWith("Store:")) {
      summary.store = line.split(":")[1]?.trim() || "";
    } else if (line.startsWith("Address:") || line.startsWith("Location:")) {
      summary.location = line.split(":")[1]?.trim() || "";
    } else if (line.startsWith("GSTIN:")) {
      summary.gstin = line.split(":")[1]?.trim() || "";
    } else if (line.startsWith("Mobile:")) {
      summary.mobile = line.split(":")[1]?.trim() || "";
    } else if (line.startsWith("Customer Name:")) {
      summary.customerName = line.split(":")[1]?.trim() || "";
    } else if (line.startsWith("Bill No:") || line.startsWith("Bill No.:") || line.startsWith("Bill Number")) {
      summary.billNo = line.split(":")[1]?.trim() || "";
    } else if (line.startsWith("Date:")) {
      summary.date = line.split(":")[1]?.trim() || "";
    } else if (line.startsWith("Items Purchased:")) {
      parsingItems = true;
      console.log("Started Parsing Items");
    }
    else if (parsingItems && line.trim("").startsWith("*")) {
      // Regex updated to handle the structure in lines 9-11
      line = line.replace(/\*\*|\*/g, "").trim();
      let productNameMatch = line.match(/^(.*?)(?:\s\(\d+ unit\))/) || line.match(/^(.*?)(?:\s\(| - )/);
      const productName = productNameMatch ? productNameMatch[1].trim() : null;

      // Extract quantity
      let quantityMatch = line.match(/\((\d+) unit\)/) || line.match(/(?:Quantity: )?(\d+) (?:unit|\))/);
      const quantity = quantityMatch ? parseInt(quantityMatch[1], 10) : null;

      // Extract price
      let priceMatch = line.match(/₹([\d,.]+)/) || line.match(/Original Price:\s*₹([\d,.]+)/);
      const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : null;

      // Extract discount
      let discountMatch = line.match(/(\d+)% discount/) || line.match(/(?:Discounted Price|₹):\s*₹([\d,.]+)/);
      const discount = discountMatch ? parseInt(discountMatch[1], 10) : null;

      summary.itemsPurchased.push({
        itemName: productName,
        quantity: quantity,
        price: price,
        discountedPrice: `${discount}%`,
      });

    } else if (line.startsWith("IGST")) {
      summary.igst = line.split(":")[1]?.trim() || "";
    } else if (line.startsWith("Total Amount:")) {
      summary.totalAmount = line.split(":")[1]?.trim() || "";
    } else {
      parsingItems = false; // Stop parsing items
    }
  });

  console.log("Final Parsed Summary:", summary);
  return summary;
};

// Helper function to extract sections
function extractSection(text, sectionTitle) {
  const regex = new RegExp(
    `\\*\\*${sectionTitle}:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\*\\*|$)`,
    "i"
  );
  const match = text.match(regex);
  if (match) {
    return match[1]
      .split("\n") // Split by line breaks
      .map((item) => item.replace(/^\* ?/, "").trim()) // Clean bullet points
      .filter((item) => item.length > 0); // Remove empty lines
  }
  return [];
}

function extractImportantNote(text) {
  const regex = /\*\*Additional Notes:\*\*\s*([\s\S]*?)(?=\n$|$)/i;
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}


module.exports={
  parseInvoiceData, parseSummary, extractSection, extractImportantNote
}