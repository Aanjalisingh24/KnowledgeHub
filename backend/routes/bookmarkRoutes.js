const express = require("express");
const Bookmark = require("../models/Bookmark");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Add bookmark
router.post("/:knowledgeId", authMiddleware, async (req, res) => {
  try {
    const { knowledgeId } = req.params;

    const existingBookmark = await Bookmark.findOne({
      user: req.user.userId,
      knowledge: knowledgeId,
    });

    if (existingBookmark) {
      return res.status(400).json({
        message: "Knowledge already bookmarked",
      });
    }

    const bookmark = await Bookmark.create({
      user: req.user.userId,
      knowledge: knowledgeId,
    });

    res.status(201).json({
      message: "Knowledge bookmarked successfully",
      bookmark,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// Get my bookmarks
router.get("/", authMiddleware, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({
      user: req.user.userId,
    })
      .populate({
        path: "knowledge",
        populate: {
          path: "author",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: bookmarks.length,
      bookmarks,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// Check if knowledge is bookmarked
router.get("/:knowledgeId/status", authMiddleware, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      user: req.user.userId,
      knowledge: req.params.knowledgeId,
    });

    res.status(200).json({
      bookmarked: !!bookmark,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// Remove bookmark
router.delete("/:knowledgeId", authMiddleware, async (req, res) => {
  try {
    const { knowledgeId } = req.params;

    const bookmark = await Bookmark.findOneAndDelete({
      user: req.user.userId,
      knowledge: knowledgeId,
    });

    if (!bookmark) {
      return res.status(404).json({
        message: "Bookmark not found",
      });
    }

    res.status(200).json({
      message: "Bookmark removed successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


module.exports = router;