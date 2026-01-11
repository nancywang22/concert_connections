import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  user: mongoose.Types.ObjectId;
  concert: mongoose.Types.ObjectId;
  caption?: string;
  imageUrl?: string;
  createdAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    concert: {
      type: Schema.Types.ObjectId,
      ref: "Concert",
      required: true,
    },
    caption: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model<IPost>("Post", PostSchema);
