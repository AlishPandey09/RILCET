// db/connectDB.js

const mongoose = require("mongoose");
require("dotenv").config();

const { MONGODB_URI, MONGODB_DB_NAME } = process.env;

if (!MONGODB_URI) {
  console.error("❌ Missing MONGODB_URI");
  process.exit(1);
}

if (!MONGODB_DB_NAME) {
  console.error("❌ Missing MONGODB_DB_NAME");
  process.exit(1);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: MONGODB_DB_NAME,
    });
    console.log(
      `✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`
    );
    return conn.connection;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
