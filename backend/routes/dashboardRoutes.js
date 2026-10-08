const express = require("express");
const Knowledge = require("../models/Knowledge");
const User = require("../models/user");
const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    
    const knowledgeCount = await Knowledge.countDocuments();

    // Knowledge updated in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentlyUpdated = await Knowledge.countDocuments({
      updatedAt: {
        $gte: sevenDaysAgo,
      },
    });

    // Total testing team members
    const teamMembers = await User.countDocuments();

    // Total knowledge items that received at least one helpful vote
    const helpfulKnowledge = await Knowledge.countDocuments({
      helpfulCount: {
        $gt: 0,
      },
    });

   
    const recentKnowledge = await Knowledge.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .limit(3);

    res.status(200).json({
      knowledgeCount,
      recentlyUpdated,
      teamMembers,
      helpfulKnowledge,
      recentKnowledge,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load dashboard data",
    });
  }
});

module.exports = router;