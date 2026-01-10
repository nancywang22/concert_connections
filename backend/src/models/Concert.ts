import mongoose, { Schema, Document, Types } from "mongoose";

export interface IConcert extends Document {
  artist: Types.ObjectId; // Reference to Artist
  setlistFmId: string;
  venue: string;
  city: string;
  date: string;
  songs: string[];
  createdAt: Date;
}

const ConcertSchema = new Schema<IConcert>({
  artist: { type: Schema.Types.ObjectId, ref: "Artist", required: true },
  setlistFmId: { type: String, required: true },
  venue: { type: String },
  city: { type: String },
  date: { type: String },
  songs: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IConcert>("Concert", ConcertSchema);
