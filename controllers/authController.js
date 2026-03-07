const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 1. REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Password Hash kora
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ success: true, message: "User registered! ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Password match kora
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // JWT Token toiri kora
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" },
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// ALL USER GET with SEARCH
exports.getAllUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

  
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ]
      };
    }

    const users = await User.find(query).select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// 4. UPDATE USER ROLE (PATCH)
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // শুধু admin বা user রোল ই এলাউ করা হবে
    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({ message: "Invalid role type" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${role} ✅`,
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// GET USER ROLE BY EMAIL
exports.getRole = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email }).select("email role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// user pass change api
// CHANGE PASSWORD (PATCH)
exports.changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password does not match!" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);


    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully! 🔐" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// এই ফাংশনটি কন্ট্রোলারের নিচে যোগ করুন
exports.updateProfile = async (req, res) => {
  try {
    const { email, name, phone, address } = req.body;

    // ইউজার খুঁজে বের করা
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ডেটা আপডেট করা (যদি রিকোয়েস্টে থাকে)
    if (name) user.name = name;
    if (phone) user.phone = phone;
    
    // শিপিং এড্রেস আপডেট (Object আকারে আসলে)
    if (address) {
      user.address = {
        apartment: address.apartment || user.address.apartment,
        city: address.city || user.address.city,
        state: address.state || user.address.state,
        postalCode: address.postalCode || user.address.postalCode,
        country: address.country || user.address.country,
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully! ✨",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};