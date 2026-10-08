const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    knowledge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Knowledge",
      required: true,
    },

    helpful: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// One feedback per user for each knowledge item
feedbackSchema.index(
  { user: 1, knowledge: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "KnowledgeFeedback",
  feedbackSchema
);