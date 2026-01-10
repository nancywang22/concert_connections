import mongoose, { Schema, Document } from "mongoose";

export interface IArtist extends Document {
  name: string;
  setlistFmId: string; // Unique ID from Setlist.fm API
  createdAt: Date;
}

const ArtistSchema: Schema = new Schema({
  name: { type: String, required: true },
  setlistFmId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export const Artist = mongoose.model<IArtist>("Artist", ArtistSchema);
