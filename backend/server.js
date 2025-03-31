require("dotenv").config();  // Load environment variables
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());  // Parse JSON requests
app.use(cors());  // Enable CORS
app.use(morgan("dev"));  // Logging for development
app.use(helmet());  // Security headers

// Rate Limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Routes (to be created)
app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/blogs", require("./routes/blogRoutes"));

// Test Route
app.get("/", (req, res) => {
  res.send("Blog API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
