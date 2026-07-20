const mongoose = require("mongoose");
// Alert model
const AlertSchema = new mongoose.Schema({
  city: String,
  threshold: Number,
  email: String,
});
module.exports = mongoose.model("Alert", AlertSchema);
