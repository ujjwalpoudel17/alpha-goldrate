const mongoose = require("mongoose");

const GoldSchema = new mongoose.Schema({
  type: String,        // Gold
  category: String,    // Fine Gold
  purity: String,      // 24K
  unit: String,        // 1 Tola
  rate_npr: Number,    // 142000
  buy: Number,         // 141800
  sell: Number,        // 142200
  timestamp: String,   // 2025-12-10T09:00:00+05:45
  source: String       // sample
}, { collection: "goldrate" });

module.exports = mongoose.model("goldrate", GoldSchema);
