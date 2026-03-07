require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Routes Import
const productRoutes = require("./routes/productRoutes");
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const port = process.env.PORT || 5001;

// 
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:5500",
  "https://seoulc.vercel.app",
  "http://localhost:5173",
  "https://sandbox.sslcommerz.com",
  "https://securepay.sslcommerz.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
    
      if (!origin || origin === "null" || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS from Origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 2. Middleware for parsing data
app.use(express.json());
// SSLCommerz ডাটা 'application/x-www-form-urlencoded' ফরম্যাটে পাঠায়, তাই এটি জরুরি:
app.use(express.urlencoded({ extended: true })); 

// 3. API Routes
app.use("/api/products", productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);


app.get("/", (req, res) => {
  res.send("Seoul Mirage API is up and running! 🚀");
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .send({ message: "Something went wrong!", error: err.message });
});


const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`✨ Server is humming along on port ${port}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

startServer();