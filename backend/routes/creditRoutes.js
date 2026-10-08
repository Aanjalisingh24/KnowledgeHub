const express = require("express");

const Knowledge = require("../models/Knowledge");
const KnowledgeCredit = require("../models/KnowledgeCredit");
const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();


// Give credit to knowledge author
router.post("/:knowledgeId", authMiddleware, async (req, res) => {
  try {
    const { knowledgeId } = req.params;

    
    const knowledge = await Knowledge.findById(knowledgeId);

    if (!knowledge) {
      return res.status(404).json({
        message: "Knowledge not found",
      });
    }

    // Prevent author from giving credit to their own knowledge
    if (knowledge.author.toString() === req.user.userId.toString()) {
      return res.status(400).json({
        message: "You cannot give credit to your own knowledge",
      });
    }

    // Check if this user already gave credit
    const existingCredit = await KnowledgeCredit.findOne({
      user: req.user.userId,
      knowledge: knowledgeId,
    });

    if (existingCredit) {
      return res.status(400).json({
        message: "You have already given credit to this knowledge",
      });
    }

    // Create credit
    const credit = await KnowledgeCredit.create({
      user: req.user.userId,
      knowledge: knowledgeId,
      author: knowledge.author,
    });

    res.status(201).json({
      message: "Credit given successfully",
      credit,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to give credit",
    });
  }
});

// Check if current user has already given credit
router.get("/:knowledgeId/status", authMiddleware, async (req, res) => {
  try {
    const { knowledgeId } = req.params;

    const credit = await KnowledgeCredit.findOne({
      user: req.user.userId,
      knowledge: knowledgeId,
    });

    res.status(200).json({
      creditGiven: !!credit,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to check credit status",
    });
  }
});

// Get total credits received by a user
router.get("/profile/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    const creditCount = await KnowledgeCredit.countDocuments({
      author: userId,
    });

    res.status(200).json({
      creditCount,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch credit count",
    });
  }
});

// Get knowledge that received credits for a user
router.get("/profile/:userId/knowledge", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    const credits = await KnowledgeCredit.find({
      author: userId,
    })
      .populate("knowledge", "title description type")
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      credits,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch credit history",
    });
  }
});


module.exports = router;