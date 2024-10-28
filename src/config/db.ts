// src/db.ts
import mongoose from "mongoose";
import autoIncrement from "mongoose-auto-increment";
import dotenv from "dotenv";

dotenv.config();

const DB_URI = process.env.DB_URI as string;

// Create a single MongoDB connection instance
const connection = mongoose.createConnection(DB_URI);

// Initialize the auto-increment plugin with the connection
autoIncrement.initialize(connection);

connection.on("connected", () => {
  console.log("MongoDB connected successfully");
});

connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

export { connection, autoIncrement };
