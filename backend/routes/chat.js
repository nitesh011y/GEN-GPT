import express from "express";
const router = express.Router();
import Thread from "../Modles/Thread.js";
import getGemAIAPIResponse from "../utils/gemminiAi.js";

//get all routes
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

//get spesific chat
router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({ threadId });

    if (!thread) {
      return res.status(404).json({ error: "thread not found" });
    }

    res.json(Array.isArray(thread.messages) ? thread.messages : []);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "failed to fetch thread" });
  }
});

router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });
    if (!deletedThread) {
      return res.status(404).json({ error: "thread not found" });
    }
    res.status(200).json({ success: "thread deleted succcessfully" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "failed to delte thread" });
  }
});

router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "missing required fields" });
  }

  try {
    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      // create a new thread in db
      thread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    // Get response from Gemini API
    const assistantReply = await getGemAIAPIResponse(message);

    thread.messages.push({
      role: "assistant",
      content: assistantReply,
    });

    thread.updatedAt = new Date();
    await thread.save();

    res.json({ reply: assistantReply });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "something went wrong" });
  }
});

export default router;
