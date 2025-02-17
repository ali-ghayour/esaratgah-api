import Redis from "ioredis";

// Create Redis client
const redisClient = new Redis({
  host: "localhost", // Change this if Redis is running on another host
  port: 6379,
});

// Handle Redis errors
redisClient.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

export default redisClient;
