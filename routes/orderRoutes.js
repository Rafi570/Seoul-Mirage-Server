const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// --- CORS Bypass Middleware (এটি যোগ করুন) ---
const corsBypass = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
};

// Existing Routes
router.get('/all', orderController.getAllOrders); 
router.post('/checkout', orderController.createOrder);
router.get('/user/:email', orderController.getUserOrders);
router.get('/unpaid/:email', orderController.getUnpaidOrders);
router.patch('/pay-success/:orderId', orderController.updatePaymentStatus);

// Admin actions
router.patch('/cancel/:orderId', orderController.cancelOrder); 
router.delete('/delete/:orderId', orderController.deleteOrder); 

// --- Payment Routes (এখানে corsBypass টা বসিয়ে দিন) ---
router.post('/init-payment', orderController.initiatePayment);

// সাকসেস রাউটের আগে corsBypass অ্যাড করা হয়েছে
router.post('/payment/success/:tranId', corsBypass, orderController.paymentSuccess);

router.post('/payment/fail/:tranId', corsBypass, (req, res) => {
    res.redirect("http://localhost:5173/orders/fail");
});

module.exports = router;