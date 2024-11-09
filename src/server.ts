// src/server.ts
import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const DB_URI = process.env.DB_URI as string; // Ensure you have your MongoDB URI in the .env file

console.log(PORT, DB_URI);

// Connect to MongoDB
mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
