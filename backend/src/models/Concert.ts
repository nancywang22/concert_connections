import mongoose, { Schema, Document } from "mongoose";

export interface IConcert extends Document {
  artistName: string;
  city: string;
  date: string;
  venue?: string;
  user: mongoose.Types.ObjectId;
}

const ConcertSchema = new Schema<IConcert>(
  {
    artistName: { type: String, required: true },
    city: { type: String, required: true },
    date: { type: String, required: true },
    venue: { type: String },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Concert = mongoose.model<IConcert>("Concert", ConcertSchema);
