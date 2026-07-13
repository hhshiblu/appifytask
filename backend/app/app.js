const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { errorHandler, notFoundHandler } = require("./error");

const app = express();

app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}

app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(require("./route"))

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;