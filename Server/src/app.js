const express = require("express");
const cors = require("./middlewares/cors");
const errorHandler = require("./middlewares/errorHandler");
const fileRoutes = require("./routes/fileRoutes");

const app = express();

app.use(cors);
app.use("/api/files", fileRoutes);
app.use(errorHandler);

module.exports = app;
