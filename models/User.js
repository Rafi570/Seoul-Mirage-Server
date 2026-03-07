const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    // নতুন ফিল্ডসমূহ
    phone: { type: String, default: "" },
    address: {
        apartment: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        postalCode: { type: String, default: "" },
        country: { type: String, default: "" }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);