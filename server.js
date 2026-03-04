require("dotenv").config();
const productRoutes = require("./routes/productRoutes");
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const port = process.env.PORT || 5001;

const allowedOrigins = ["http://localhost:3000","http://127.0.0.1:5500"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.use("/api/products", productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.get("/", (req, res) => {
  res.send("seoulmirage's API is up and running! 🚀");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .send({ message: "Something went wrong!", error: err.message });
});

app.listen(port, () => {
  console.log(`✨ Server is humming along on port ${port}`);
});

connectDB();
