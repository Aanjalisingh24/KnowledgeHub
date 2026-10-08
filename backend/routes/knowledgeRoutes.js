const express = require("express");
const Knowledge = require("../models/Knowledge");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create knowledge
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, content, type, tags } = req.body;

    if (!title || !description || !content || !type) {
      return res.status(400).json({
        message: "Title, description, content and type are required",
      });
    }

    const knowledge = await Knowledge.create({
      title,
      description,
      content,
      type,
      tags,
      author: req.user.userId,
    });

    res.status(201).json({
      message: "Knowledge created successfully",
      knowledge,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// Get all knowledge
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { search, type } = req.query;

    const filter = {};

    // Search
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by type
    if (type) {
      filter.type = type;
    }

    const knowledge = await Knowledge.find(filter)
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: knowledge.length,
      knowledge,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// Get single knowledge
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const knowledge = await Knowledge.findById(req.params.id)
      .populate("author", "name email");

    if (!knowledge) {
      return res.status(404).json({
        message: "Knowledge not found",
      });
    }

    // Increase view count
    const isAuthor =
      knowledge.author._id.toString() ===
      req.user.userId.toString();

    if (!isAuthor) {
      knowledge.views += 1;
      await knowledge.save();
    }

    res.status(200).json({
      knowledge,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// Update knowledge
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, content, type, tags } = req.body;

    const knowledge = await Knowledge.findById(req.params.id);

    if (!knowledge) {
      return res.status(404).json({
        message: "Knowledge not found",
      });
    }

    // Only author or admin can edit
    const isAuthor = knowledge.author.toString() === req.user.userId;
    const isAdmin = req.user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        message: "You can only edit your own knowledge",
      });
    }

    knowledge.title = title ?? knowledge.title;
    knowledge.description = description ?? knowledge.description;
    knowledge.content = content ?? knowledge.content;
    knowledge.type = type ?? knowledge.type;
    knowledge.tags = tags ?? knowledge.tags;

    await knowledge.save();

    const updatedKnowledge = await Knowledge.findById(knowledge._id)
      .populate("author", "name email");

    res.status(200).json({
      message: "Knowledge updated successfully",
      knowledge: updatedKnowledge,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// Delete knowledge
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const knowledge = await Knowledge.findById(req.params.id);

    if (!knowledge) {
      return res.status(404).json({
        message: "Knowledge not found",
      });
    }

    // Only author or admin can delete
    const isAuthor = knowledge.author.toString() === req.user.userId;
    const isAdmin = req.user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        message: "You can only delete your own knowledge",
      });
    }

    await Knowledge.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Knowledge deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;