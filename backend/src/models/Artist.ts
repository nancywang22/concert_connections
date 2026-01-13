// Import mongoose and commonly used types:
// - Schema: defines the structure of a MongoDB document
// - Document: base interface for MongoDB documents in Mongoose
import mongoose, { Schema, Document } from "mongoose";

// Define the TypeScript interface for an Artist document
export interface IArtist extends Document {
  // Name of the artist
  name: string;

  // Unique identifier from the Setlist.fm API
  setlistFmId: string;

  // Timestamp for when the artist was created in your database
  createdAt: Date;
}

// Define the Mongoose schema for the Artist collection
const ArtistSchema: Schema = new Schema({
  // Artist name is required
  name: { type: String, required: true },

  // Setlist.fm ID is required and must be unique
  // Prevents duplicate artist records for the same external artist
  setlistFmId: { type: String, required: true, unique: true },

  createdAt: { type: Date, default: Date.now },
});

// Create and export the Artist model
// This provides an interface for interacting with the "artists" collection
// (e.g., find, create, update, delete artists)
export const Artist = mongoose.model<IArtist>("Artist", ArtistSchema);
