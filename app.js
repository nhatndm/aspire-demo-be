require("dotenv").config();
var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var Routes = require("./routes");
var app = express();
var mongoose = require("mongoose");
var cors = require("cors");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

mongoose.connect("mongodb://localhost:27017/loan-payment", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

Routes(app);

module.exports = app;
