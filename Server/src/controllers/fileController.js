const { processFile, parseAndSummarize } = require("../services/fileService");

exports.uploadFile = async (req, res, next) => {
  try {
    const { path, originalname, mimetype } = req.file;

    if (mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      const summary = await processFile(path);
      return res.status(200).json({ summary });
    }

    const structuredSummary = await parseAndSummarize(path, originalname, mimetype);
    return res.status(200).json({ summary: structuredSummary });
  } catch (error) {
    next(error);
  }
};
