const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., "Wash & Fold", "Ironing"
    description: { type: String },
    pricePerUnit: { type: Number, required: true }, // Price per kg or per piece
    category: {
      type: String,
      enum: ["Wash", "Iron", "Dry Clean"],
      required: true,
    },
    image: { type: String }, // URL for service icon
  },
  { timestamps: true },
);

module.exports = mongoose.model("Service", serviceSchema);
