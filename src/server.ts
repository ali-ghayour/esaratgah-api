// src/server.ts
import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT ;
const db_url = process.env.DB_URL as string; // Ensure you have your MongoDB URI in the .env file
console.log(db_url, port);


// Connect to MongoDB
mongoose
  .connect(db_url)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
