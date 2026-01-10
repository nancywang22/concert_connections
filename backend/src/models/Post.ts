import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";
import { IConcert } from "./Concert";

export interface IPost extends Document {
  user: mongoose.Types.ObjectId | IUser;
  concert: mongoose.Types.ObjectId | IConcert;
  imageUrl: string;
  caption: string;
  createdAt: Date;
}

const PostSchema = new Schema<IPost>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  concert: { type: Schema.Types.ObjectId, ref: "Concert", required: true },
  imageUrl: { type: String, required: true },
  caption: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPost>("Post", PostSchema);
