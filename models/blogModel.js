import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
  category: {
    type: String,

    required: true,
  },
  createDate: {
    type: Date,
    required: true,
  },
});

export default mongoose.model("blog", blogSchema);
