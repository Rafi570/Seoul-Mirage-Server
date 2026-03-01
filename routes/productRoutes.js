const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Routes definition
router.get('/', productController.getAllProducts);        // Get All
router.get('/:id', productController.getSingleProduct);   // Get Single
router.post('/', productController.createProduct);        // Create
router.patch('/:id', productController.updateProduct);    // Update
router.delete('/:id', productController.deleteProduct);   // Delete

module.exports = router;