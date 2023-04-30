const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1/dailyPost");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error in mongoose connection!"));

db.once("open", () => {
  console.log("Mongoose connection is successful.");
});

module.exports = db;
