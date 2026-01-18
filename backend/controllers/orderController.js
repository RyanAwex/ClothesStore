import Order from "../models/Order.js";
import mongoose from "mongoose";

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    console.log("Error while fetching orders:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const addOrder = async (req, res) => {
  const { customerName, email, phone, location, paymentMethod, items, total } =
    req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Order items are required" });
  }

  try {
    const order = new Order({
      customerName,
      email,
      phone,
      location,
      paymentMethod,
      items,
      total,
    });
    await order.save();
    return res.status(201).json({ success: true, order });
  } catch (error) {
    console.log("Error while creating order:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Order id is required" });
    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    return res.status(200).json({ success: true, message: "Order deleted" });
  } catch (error) {
    console.log("Error while deleting order:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
