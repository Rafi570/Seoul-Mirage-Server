const Product = require("../models/Product");

// 1. GET ALL PRODUCTS
// 1. GET ALL PRODUCTS with optional pagination
// 1. GET ALL PRODUCTS (With Search & Pagination)
exports.getAllProducts = async (req, res) => {
  try {
    const { page, limit, q } = req.query;
    
    // সার্চ ফিল্টার তৈরি
    let query = {};
    if (q) {
      query = {
        $or: [
          { name: { $regex: q, $options: "i" } },        // নামের মধ্যে সার্চ করবে
          { category: { $regex: q, $options: "i" } },    // ক্যাটাগরির মধ্যে সার্চ করবে
          { description: { $regex: q, $options: "i" } } // ডেসক্রিপশনের মধ্যে সার্চ করবে
        ]
      };
    }

    const pageNum = parseInt(page) || 0;
    const limitNum = parseInt(limit) || 0;

    if (pageNum > 0 && limitNum > 0) {
      // Paginated response
      const skip = (pageNum - 1) * limitNum;
      const totalProducts = await Product.countDocuments(query);
      const products = await Product.find(query).skip(skip).limit(limitNum);

      const totalPages = Math.ceil(totalProducts / limitNum);

      res.status(200).json({
        success: true,
        page: pageNum,
        totalPages,
        totalProducts,
        count: products.length,
        data: products,
      });
    } else {
      // Return all or filtered products if no page/limit provided
      const products = await Product.find(query);
      res.status(200).json(products);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. GET SINGLE PRODUCT
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Invalid ID format" });
  }
};

// 3. POST (CREATE) PRODUCT

exports.createProduct = async (req, res) => {
  try {
    let result;
    if (Array.isArray(req.body)) {
      // Bulk insert
      result = await Product.insertMany(req.body);
    } else {
      // Single insert
      const product = new Product(req.body);
      result = await product.save();
    }

    // Response-e message shoho data pathano
    res.status(201).json({
      success: true,
      message: Array.isArray(req.body)
        ? `${result.length} products added successfully! ✅`
        : "Product added successfully! ✅",
      data: result,
    });
  } catch (err) {
    console.error("Save Error:", err.message);
    res.status(400).json({
      success: false,
      message: "Failed to add products",
      error: err.message,
    });
  }
};

// 4. PATCH (UPDATE) PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 5. DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
