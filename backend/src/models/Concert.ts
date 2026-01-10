import mongoose, { Schema, Document, Types } from "mongoose";

export interface IConcert extends Document {
  artist: Types.ObjectId; // Reference to Artist
  date: Date;
  venue: string;
  city: string;
  userMemories: {
    userId: string;      // ID of the user
    rating?: number;     // Optional rating
    memory?: string;     // Optional text memory
    photoUrl?: string;   // Optional photo URL
  }[];
  createdAt: Date;
}

const ConcertSchema: Schema = new Schema({
  artist: { type: Schema.Types.ObjectId, ref: "Artist", required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  city: { type: String, required: true },
  userMemories: [
    {
      userId: { type: String, required: true },
      rating: { type: Number },
      memory: { type: String },
      photoUrl: { type: String },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export const Concert = mongoose.model<IConcert>("Concert", ConcertSchema);
