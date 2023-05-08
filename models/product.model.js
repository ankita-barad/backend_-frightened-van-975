const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  material: { type: String, required: true },
  metal: [{ type: String, required: true }],
  size: [{ type: Number, required: true }],
});

const ProductModel = mongoose.model("product", productSchema);
module.exports = { ProductModel };
