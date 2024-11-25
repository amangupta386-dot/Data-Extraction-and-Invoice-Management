exports.parseInvoiceData = (input) => {
    try {
      // Locate the JSON block in the input text
      const jsonStart = input.indexOf("```json") + 7;
      const jsonEnd = input.indexOf("```", jsonStart);
  
      // Validate the presence of JSON block
      if (jsonStart < 7 || jsonEnd === -1) {
        console.error("No valid JSON block found in input.");
        return null;
      }
  
      // Extract and parse the JSON
      const jsonString = input.substring(jsonStart, jsonEnd).trim();
      const parsedData = JSON.parse(jsonString);
  
      console.log("Successfully parsed invoice data:", parsedData);
      return parsedData;
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return null;
    }
  };
  
  exports.parseSummary = (rawText) => {
    try {
      console.log("Raw Summary Text:", rawText);
  
      // Split and filter lines
      const lines = rawText.split("\n").filter((line) => line.trim() !== "");
  
      const summary = {
        retailer: "",
        address: "",
        gstin: "",
        customer: "",
        billNo: "",
        date: "",
        items: [],
        total: "",
        additionalNotes: "",
      };
  
      let isParsingItems = false;
  
      // Iterate through lines to extract structured data
      lines.forEach((line) => {
        line = line.replace(/^\*+/, "").trim(); // Remove bullet points and clean line
  
        if (/^(Retailer|Store|Seller):/i.test(line)) {
          summary.retailer = line.split(":")[1]?.trim() || "";
        } else if (/^(Address|Location):/i.test(line)) {
          summary.address = line.split(":")[1]?.trim() || "";
        } else if (/^GSTIN:/i.test(line)) {
          summary.gstin = line.split(":")[1]?.trim() || "";
        } else if (/^(Customer|Buyer):/i.test(line)) {
          summary.customer = line.split(":")[1]?.trim() || "";
        } else if (/^(Bill No|Invoice Number):/i.test(line)) {
          summary.billNo = line.split(":")[1]?.trim() || "";
        } else if (/^Date:/i.test(line)) {
          summary.date = line.split(":")[1]?.trim() || "";
        } else if (/^Items:/i.test(line)) {
          isParsingItems = true; // Start parsing items
        } else if (isParsingItems) {
          // Parse items from line
          const itemMatch = line.match(/^(.*?)(?: - (\d+) units at ₹([\d,.]+))?/);
          if (itemMatch) {
            const itemName = itemMatch[1]?.trim() || "";
            const quantity = itemMatch[2] ? parseInt(itemMatch[2], 10) : null;
            const price = itemMatch[3] ? parseFloat(itemMatch[3].replace(/,/g, "")) : null;
  
            summary.items.push({ name: itemName, quantity, price });
          }
        } else if (/^Total:/i.test(line)) {
          summary.total = line.split(":")[1]?.trim() || "";
        } else if (/^Notes:/i.test(line)) {
          summary.additionalNotes = line.split(":")[1]?.trim() || "";
        }
      });
  
      console.log("Parsed Summary Object:", summary);
      return summary;
    } catch (error) {
      console.error("Failed to parse summary text:", error);
      return null;
    }
  };
  