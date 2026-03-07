const Order = require("../models/Order");
const SSLCommerzPayment = require('sslcommerz-lts');



exports.initiatePayment = async (req, res) => {
    const { orderIds, totalAmount, shippingAddress } = req.body;
    
 
    const tran_id = `REF-${Date.now()}`; 

    const data = {
        total_amount: totalAmount,
        currency: 'BDT',
        tran_id: tran_id, 
        success_url: `http://localhost:5001/api/orders/payment/success/${tran_id}`,
        fail_url: `http://localhost:5001/api/orders/payment/fail/${tran_id}`,
        cancel_url: `http://localhost:5001/api/orders/payment/cancel/${tran_id}`,
        ipn_url: `http://localhost:5001/api/orders/payment/ipn`,
        shipping_method: 'Courier',
        product_name: 'Seoul Mirage Products',
        product_category: 'Skincare',
        product_profile: 'general',
        cus_name: shippingAddress.name,
        cus_email: shippingAddress.email,
        cus_add1: shippingAddress.address,
        cus_city: shippingAddress.city,
        cus_country: 'Bangladesh',
        cus_phone: shippingAddress.phone,
        ship_name: shippingAddress.name,
        ship_add1: shippingAddress.address,
        ship_city: shippingAddress.city,
        ship_state: shippingAddress.state,
        ship_postcode: shippingAddress.postCode,
        ship_country: 'Bangladesh',
    };

    const sslcz = new SSLCommerzPayment(process.env.STORE_ID, process.env.STORE_PASSWORD, false);
    
    try {
   
        await Order.updateMany(
            { _id: { $in: orderIds } },
            { $set: { transactionId: tran_id } }
        );

        sslcz.init(data).then(apiResponse => {
            let GatewayPageURL = apiResponse.GatewayPageURL;
            res.send({ url: GatewayPageURL });
        });
    } catch (error) {
        res.status(500).json({ message: "Payment initialization failed", error: error.message });
    }
};


exports.paymentSuccess = async (req, res) => {
    try {
        const { tranId } = req.params;

        await Order.updateMany(
            { transactionId: tranId },
            { $set: { status: "Paid" } }
        );

        res.redirect("http://localhost:5173/orders/success");
    } catch (error) {
        res.redirect("http://localhost:5173/orders/fail");
    }
};
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
