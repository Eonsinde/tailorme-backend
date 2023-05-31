const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      max: 1000,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);