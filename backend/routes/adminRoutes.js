const express = require("express");
const User = require("../models/user");
const Knowledge = require("../models/Knowledge");
const KnowledgeFeedback = require("../models/KnowledgeFeedback");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const Bookmark = require("../models/Bookmark");

const router = express.Router();

// Admin dashboard statistics
router.get("/stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalKnowledge = await Knowledge.countDocuments();

    const totalUsers = await User.countDocuments();

    const totalContributors = await User.countDocuments({
      role: "contributor",
    });

    const totalHelpfulFeedback = await KnowledgeFeedback.countDocuments({
      helpful: true,
    });

    res.status(200).json({
      totalKnowledge,
      totalUsers,
      totalContributors,
      totalHelpfulFeedback,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load admin statistics",
    });
  }
});


// Get all users
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load users",
    });
  }
});

// Change user role
router.put(
  "/users/:id/role",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { role } = req.body;

      if (!["admin", "contributor"].includes(role)) {
        return res.status(400).json({
          message: "Invalid role",
        });
      }

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      user.role = role;

      await user.save();

      res.status(200).json({
        message: "User role updated successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to update user role",
      });
    }
  }
);

// Delete user
router.delete(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const userId = req.params.id;

      // Prevent admin from deleting themselves
      if (userId === req.user.userId.toString()) {
        return res.status(400).json({
          message: "You cannot delete your own account",
        });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Don't allow deletion if user has created knowledge
      const knowledgeCount = await Knowledge.countDocuments({
        author: userId,
      });

      if (knowledgeCount > 0) {
        return res.status(400).json({
          message:
            "This user has created knowledge and cannot be deleted.",
        });
      }

      // Remove user's bookmarks
      await Bookmark.deleteMany({
        user: userId,
      });

      // Remove user's feedback
      await KnowledgeFeedback.deleteMany({
        user: userId,
      });

      // Delete user
      await User.findByIdAndDelete(userId);

      res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to delete user",
      });
    }
  }
);

router.delete(
  "/knowledge/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const knowledgeId = req.params.id;

      const knowledge = await Knowledge.findById(knowledgeId);

      if (!knowledge) {
        return res.status(404).json({
          message: "Knowledge not found",
        });
      }

      // Delete related bookmarks
      await Bookmark.deleteMany({
        knowledge: knowledgeId,
      });

      // Delete related feedback
      await KnowledgeFeedback.deleteMany({
        knowledge: knowledgeId,
      });

      // Delete knowledge
      await Knowledge.findByIdAndDelete(knowledgeId);

      res.status(200).json({
        message: "Knowledge deleted successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to delete knowledge",
      });
    }
  }
);

module.exports = router;