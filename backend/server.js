import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { ragQuery } from "./rag.js";
import redisClient from "./redis.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Start chat session
app.post("/api/chat", async (req, res) => {
  try {
    const { sessionId, query } = req.body;
    if (!sessionId || !query)
      return res.status(400).json({ error: "Missing params" });

    // Call RAG pipeline
    const answer = await ragQuery(query);

    // Save to Redis
    await redisClient.rpush(sessionId, JSON.stringify({ role: "user", content: query }));
    await redisClient.rpush(sessionId, JSON.stringify({ role: "assistant", content: answer }));

    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Chat failed" });
  }
});

// Get chat history
app.get("/api/history/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const history = await redisClient.lrange(sessionId, 0, -1);
    res.json(history.map(JSON.parse));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// Reset session
app.post("/api/reset", async (req, res) => {
  try {
    const { sessionId } = req.body;
    await redisClient.del(sessionId);
    res.json({ message: "Session reset" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to reset session" });
  }
});

// Test env variables
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY);
console.log("REDIS_URL:", process.env.REDIS_URL);
console.log("QDRANT_URL:", process.env.QDRANT_URL);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
