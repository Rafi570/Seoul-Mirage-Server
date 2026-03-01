const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: Number,
    category: String,
    mainImage: String,
    images: [String], // Array of 4 images for mapping
    rating: { type: Number, default: 0 },
    reviews_count: { type: Number, default: 0 },
    description: String,
    details: String,
    stock: Number
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);