import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: { type: String },
    color: { type: String },
    size: { type: String },
    price: { type: Number },
    quantity: { type: Number, default: 1 },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    customerName: String,
    email: String,
    phone: String,
    location: String,
    paymentMethod: String,
    items: [orderItemSchema],
    total: Number,
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
