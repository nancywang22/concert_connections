// models/Post.ts
import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    concert: { type: mongoose.Schema.Types.ObjectId, ref: "Concert", required: true },

    caption: String,
    imageUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
