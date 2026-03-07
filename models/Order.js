const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    items: Array,
    shippingAddress: {
        name: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        postCode: String
    },
    totalAmount: Number,
    transactionId: { type: String },
    status: { 
        type: String, 
        enum: ['Unpaid', 'Paid', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Unpaid' 
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);