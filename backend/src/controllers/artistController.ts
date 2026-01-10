import { Request, Response } from "express";
import { Artist, IArtist } from "../models/Artist";
import { searchArtists } from "../services/setlistfmService";

export async function artistSearchHandler(req: Request, res: Response) {
  try {
    const query = req.query.q as string;
    if (!query) return res.status(400).json({ error: "Query parameter 'q' is required" });

    const setlistArtists = await searchArtists(query);

    const savedArtists: IArtist[] = [];

    for (const a of setlistArtists) {
      let artist = await Artist.findOne({ setlistFmId: a.mbid || a.id });
      if (!artist) {
        artist = new Artist({
          name: a.name,
          setlistFmId: a.mbid || a.id,
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
