"use strict";

var express = require("express");
var cors = require("cors");
var multer = require("multer");
require("dotenv").config();
var fileController = require("./controllers/fileController");
var app = express();
var upload = multer({
  dest: "uploads/"
});
app.use(cors());

// File upload route
app.post("/upload", upload.single("file"), fileController.uploadFile);
module.exports = app;