import { Request, Response } from "express";
import { Artist, IArtist } from "../models/Artist";
import { searchArtists, getConcertsByArtist } from "../services/setlistfmService";

// ---------------------------
// Search artists by name
// ---------------------------
export async function artistSearchHandler(req: Request, res: Response) {
  try {
    const query = req.query.q as string;
    if (!query) return res.status(400).json({ error: "Query parameter 'q' is required" });

    const setlistArtists = await searchArtists(query);

    const savedArtists: IArtist[] = [];

    for (const a of setlistArtists) {
      // Use MBID if available, fallback to Setlist.fm ID
      const setlistFmId = a.mbid || a.id;
      let artist = await Artist.findOne({ setlistFmId });

      if (!artist) {
        artist = new Artist({
          name: a.name,
          setlistFmId,
        });
        await artist.save();
      }

      savedArtists.push(artist);
    }

    res.json(savedArtists);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

// ---------------------------
// Get concerts for a single artist
// ---------------------------
export async function concertsByArtistHandler(req: Request, res: Response) {
  try {
    const artistId = req.params.artistId;
    const artist = await Artist.findById(artistId);

    if (!artist) return res.status(404).json({ error: "Artist not found" });

    // Fetch concerts using Setlist.fm ID
    const concerts = await getConcertsByArtist(artist.setlistFmId);
    res.json(concerts);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
