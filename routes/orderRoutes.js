// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// SSLCommerz পেমেন্ট রাউটস (এগুলো POST হতে হবে)
router.post('/payment/success/:tranId', orderController.paymentSuccess);
router.post('/payment/fail/:tranId', orderController.paymentFail);
router.post('/payment/cancel/:tranId', orderController.paymentCancel);

// বাকি রাউটস
router.get('/all', orderController.getAllOrders); 
router.post('/checkout', orderController.createOrder);
router.get('/user/:email', orderController.getUserOrders);
router.get('/unpaid/:email', orderController.getUnpaidOrders);
router.post('/init-payment', orderController.initiatePayment);
router.patch('/pay-success/:orderId', orderController.updatePaymentStatus);
router.patch('/cancel/:orderId', orderController.cancelOrder); 
router.delete('/delete/:orderId', orderController.deleteOrder); 

module.exports = router;