import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Comment", CommentSchema);
