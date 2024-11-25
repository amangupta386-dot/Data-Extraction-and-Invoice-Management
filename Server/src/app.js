const express = require("express");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

const fileController = require("./controllers/fileController");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());

// File upload route
app.post("/upload", upload.single("file"), fileController.uploadFile);
app.get("/", (req, res) => {
    res.send("Welcome to the File Upload API!");
  });
module.exports = app;
