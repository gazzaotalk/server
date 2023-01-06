const express = require("express");

const diagnostics = express.Router();

diagnostics.get("/health", (req, res) => {
  res.send("OK");
});

module.exports = diagnostics;
