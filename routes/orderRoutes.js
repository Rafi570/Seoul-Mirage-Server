const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/all', orderController.getAllOrders); 
router.post('/checkout', orderController.createOrder);
router.get('/user/:email', orderController.getUserOrders);
router.get('/unpaid/:email', orderController.getUnpaidOrders);
router.patch('/pay-success/:orderId', orderController.updatePaymentStatus);
// Admin actions
router.patch('/cancel/:orderId', orderController.cancelOrder); 
router.delete('/delete/:orderId', orderController.deleteOrder); // Order delete korar jonno
module.exports = router;