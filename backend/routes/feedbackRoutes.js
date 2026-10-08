const express = require("express");
const KnowledgeFeedback = require("../models/KnowledgeFeedback");
const Knowledge = require("../models/Knowledge");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// Submit or update feedback
router.post("/:knowledgeId", authMiddleware, async (req, res) => {
  try {
    const { helpful  } = req.body;
    const { knowledgeId } = req.params;

    if (typeof helpful !== "boolean") {
      return res.status(400).json({
        message: "Helpful must be true or false",
      });
    }

    const knowledge = await Knowledge.findById(knowledgeId);

    if (!knowledge) {
      return res.status(404).json({
        message: "Knowledge not found",
      });
    }

    const existingFeedback = await KnowledgeFeedback.findOne({
      user: req.user.userId,
      knowledge: knowledgeId,
    });

    if (existingFeedback) {
      existingFeedback.helpful = helpful;
      await existingFeedback.save();
    } else {
      await KnowledgeFeedback.create({
        user: req.user.userId,
        knowledge: knowledgeId,
        helpful,
      });
    }

    // Recalculate helpful count
    const helpfulCount = await KnowledgeFeedback.countDocuments({
      knowledge: knowledgeId,
      helpful: true,
    });

    knowledge.helpfulCount = helpfulCount;
    await knowledge.save();

    res.status(200).json({
      message: "Feedback saved successfully",
      helpfulCount,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// Get current user's feedback
router.get("/:knowledgeId", authMiddleware, async (req, res) => {
  try {
    const feedback = await KnowledgeFeedback.findOne({
      user: req.user.userId,
      knowledge: req.params.knowledgeId,
    });

    res.status(200).json({
      feedback: feedback
        ? feedback.helpful
        : null,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


module.exports = router;