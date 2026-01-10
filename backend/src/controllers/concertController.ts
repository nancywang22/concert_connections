import { Request, Response } from "express";
import Concert from "../models/Concert";
import { Artist } from "../models/Artist";
import { AuthRequest } from "../middleware/authMiddleware";
import { getConcertsForArtist } from "../services/setlistfmService";


// Create / log a concert
export async function logConcertHandler(req: AuthRequest, res: Response) {
  const { artistId, city, date, setlist } = req.body;

  if (!artistId || !city || !date) {
    return res.status(400).json({ error: "artistId, city, and date are required" });
  }

  try {
    const artist = await Artist.findById(artistId);
    if (!artist) return res.status(404).json({ error: "Artist not found" });

    const concert = new Concert({
      artist: artist._id,
      city,
      date,
      setlist: setlist || [],
    });

    await concert.save();

    // Optionally, add this concert to the user's list
    if (req.userId) {
      const User = (await import("../models/User")).default;
      await User.findByIdAndUpdate(req.userId, { $push: { concerts: concert._id } });
    }

    res.json(concert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to log concert" });
  }
}


// Get all concerts for a user
export async function getUserConcertsHandler(req: AuthRequest, res: Response) {
  if (!req.userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const User = (await import("../models/User")).default;
    const user = await User.findById(req.userId).populate({
      path: "concerts",
      populate: { path: "artist" },
    });

    res.json(user?.concerts || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get concerts" });
  }
}


// Fetch upcoming/past concerts for a specific artist from Setlist.fm
export async function getConcertsForArtistHandler(req: Request, res: Response) {
  const { setlistFmId } = req.params;

  if (!setlistFmId) {
    return res.status(400).json({ error: "setlistFmId is required" });
  }

  try {
    const concerts = await getConcertsForArtist(setlistFmId);
    // Simplify the data sent to frontend
    const formatted = concerts.map((c: any) => ({
      id: c.id || c["@id"], // Setlist.fm ID
      venue: c.venue?.name,
      city: c.venue?.city?.name,
      date: c.eventDate,
      songs: c.sets?.set?.flatMap((s: any) => s.song?.map((song: any) => song.name)) || [],
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch concerts for artist" });
  }
}

export const searchConcertsHandler = async (req: Request, res: Response) => {
  const { artistName, city } = req.query;

  if (!artistName || !city) {
    return res.status(400).json({ error: "artistName and city are required" });
  }

  try {
    const concerts = await Concert.find({
      artistName: artistName.toString(),
      city: city.toString(),
    }).sort({ date: 1 }); // sort by date ascending

    res.json(concerts);
  } catch (err) {
    console.error("Concert search error:", err);
    res.status(500).json({ error: "Server error" });
  }
};