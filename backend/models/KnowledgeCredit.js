const mongoose = require("mongoose");

const knowledgeCreditSchema = new mongoose.Schema(
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

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// A user can give credit to the same knowledge only once
knowledgeCreditSchema.index(
  { user: 1, knowledge: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "KnowledgeCredit",
  knowledgeCreditSchema
);