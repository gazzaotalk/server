const mongoose = require("mongoose");
const settings = require("./settings");

const { MONGODB_URI } = settings;

const db = {
  connect() {
    return new Promise((resolve) => {
      mongoose.connect(MONGODB_URI).then((connection) => {
        console.log("Successfully connected to mongodb");
        resolve(connection);
      });
    });
  },
};

module.exports = db;
