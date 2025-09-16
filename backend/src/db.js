const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/expense_tracker";

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB successfully");
    return mongoose.connection;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = { connectToDatabase };
