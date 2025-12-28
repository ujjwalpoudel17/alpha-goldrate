const express = require("express");
const mongoose = require("mongoose");
const Gold = require("./models/goldrate");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("GoldRate DB connected"))
  .catch(err => console.error(err));

app.get("/goldrate", async (req, res) => {
  try {
    const records = await Gold.find({});
    const result = {
      date: records[0]?.timestamp?.split("T")[0] || "",
      unit: "1 Tola",
      source: "NRB",
      gold: {}
    };
    records.forEach(item => {
      result.gold[item.purity] = {
        category: item.category,
        rate: item.rate_npr,
        buy: item.buy,
        sell: item.sell
      };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//gold-suggest
app.get("/goldrate-suggest", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.json([]);

    const results = await Gold.find({
      $or: [
        { purity: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } }
      ]
    })
    .select("purity category -_id")
    .limit(10);

    const suggestions = results.map(
      g => `${g.category} (${g.purity})`
    );

    res.json(suggestions);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});





app.listen(4003, "0.0.0.0", () => console.log("GoldRate running on port 4003"));
