import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  color: { type: String, required: true },
  image: { type: String, required: true },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    details: { type: String },
    variants: [variantSchema],
    sizes: [{ type: String }],
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
