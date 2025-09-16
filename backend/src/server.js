require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectToDatabase } = require("./db");
const expenseRoutes = require("./routes/expenses");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Expense Tracker API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use("/api/expenses", expenseRoutes);

// API info route
app.get("/api", (req, res) => {
  res.json({
    message: "Expense Tracker API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      api: "/api",
      expenses: "/api/expenses",
      stats: "/api/expenses/stats",
    },
  });
});

// Root welcome route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Expense Tracker API",
    docs: {
      health: "/health",
      apiInfo: "/api",
      expenses: "/api/expenses",
      stats: "/api/expenses/stats",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// Start server
const startServer = async () => {
  try {
    await connectToDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API info: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
