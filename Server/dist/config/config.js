"use strict";

var _require = require("@google/generative-ai"),
  GoogleGenerativeAI = _require.GoogleGenerativeAI;
var _require2 = require("@google/generative-ai/server"),
  GoogleAIFileManager = _require2.GoogleAIFileManager;
var genAI = new GoogleGenerativeAI(process.env.API_KEY);
var fileManager = new GoogleAIFileManager(process.env.API_KEY);
module.exports = {
  genAI: genAI,
  fileManager: fileManager
};