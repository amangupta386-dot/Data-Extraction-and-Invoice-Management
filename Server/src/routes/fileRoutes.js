const express = require("express");
const upload = require("../middlewares/upload");
const { uploadFile } = require("../controllers/fileController");

const router = express.Router();

router.post("/upload", upload, uploadFile);

module.exports = router;
