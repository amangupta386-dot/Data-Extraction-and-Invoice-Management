exports.extractSection = (text, sectionTitle) => {
    const regex = new RegExp(
      `\\*\\*${sectionTitle}:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\*\\*|$)`,
      "i"
    );
    const match = text.match(regex);
    return match ? match[1].trim() : null;
  };
  