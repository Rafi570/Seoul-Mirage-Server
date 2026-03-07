const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/users", authController.getAllUsers);
router.patch("/update-role/:id", authController.updateUserRole);
router.get("/role", authController.getRole);
router.patch('/change-password', authController.changePassword);

module.exports = router;
