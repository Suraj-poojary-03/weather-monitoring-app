const mongoose = require("mongoose");

const DailySummarySchema = new mongoose.Schema({
  city: String,
  date: Date,
  avgTemp: Number,
  maxTemp: Number,
  minTemp: Number,
  avgHumidity: Number,
  avgWindSpeed: Number,
  dominantCondition: String,
  weatherConditions: {
    type: Map,
    of: Number,
    default: {},
  },
});

module.exports = mongoose.model("DailySummary", DailySummarySchema);