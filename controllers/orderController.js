const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const { userEmail, shippingAddress, items, totalAmount } = req.body;
    const newOrder = new Order({
      userEmail,
      shippingAddress,
      items,
      totalAmount,
      status: "Unpaid",
    });
    const savedOrder = await newOrder.save();
    res
      .status(201)
      .json({ message: "Order placed successfully!", orderId: savedOrder._id });
  } catch (error) {
    res.status(500).json({ message: "Checkout failed!", error: error.message });
  }
};
// get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};
exports.getUserOrders = async (req, res) => {
  try {
    const email = req.params.email;
    const orders = await Order.find({ userEmail: email }).sort({
      createdAt: -1,
    });
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

exports.getUnpaidOrders = async (req, res) => {
  try {
    const email = req.params.email;
    const unpaidOrders = await Order.find({
      userEmail: email,
      status: "Unpaid",
    });
    res.status(200).json(unpaidOrders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching unpaid orders", error: error.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: "Paid" },
      { new: true },
    );
    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });
    res
      .status(200)
      .json({ message: "Payment successful!", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { role } = req.body;

    // সুরক্ষা চেক
    if (role !== "admin") {
      return res.status(403).json({ message: "Only admins can cancel orders" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: "Cancelled" },
      { new: true },
    );

    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });
    res
      .status(200)
      .json({ message: "Order cancelled successfully!", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { role } = req.body; // Role চেক করার জন্য

    if (role !== "admin") {
      return res.status(403).json({ message: "Only admins can delete orders" });
    }

    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder)
      return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order deleted from database!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
