// models/Concert.ts
import mongoose from "mongoose";

const ConcertSchema = new mongoose.Schema({
  artistName: { type: String, required: true },
  concertName: { type: String },
  city: { type: String, required: true },
  venue: { type: String },
  date: { type: String, required: true },

  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

export const Concert = mongoose.model("Concert", ConcertSchema);
