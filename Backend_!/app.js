import express from "express";
import cors from "cors";

import "dotenv/config";
import db from "./config/db.js";

// Connect to database
db();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // FIXED
app.use(express.urlencoded({ extended: true })); // Keep this if you want form-data parsing

// Routes
import chat from "./routes/chat.js";
app.use("/GPT", chat);

// Start server
app.listen(3000, () => {
  console.log("server listening on port 3000");
});
