const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

// Same user cannot bookmark the same knowledge twice
bookmarkSchema.index(
  { user: 1, knowledge: 1 },
  { unique: true }
);

module.exports = mongoose.model("Bookmark", bookmarkSchema);