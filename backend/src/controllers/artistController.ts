import { Request, Response } from "express";
import { Artist, IArtist } from "../models/Artist";
import { searchArtists, getConcertsByArtist } from "../services/setlistfmService";

/*
|--------------------------------------------------------------------------
| Artist Search Handler
|--------------------------------------------------------------------------
| This controller handles searching for artists by name.
| It:
| 1. Accepts a query string from the client 
| 2. Searches Setlist.fm for matching artists
| 3. Saves artists to MongoDB if they do not already exist
| 4. Returns the saved artist records to the frontend
|
| Route example:
| GET /artists/search?q=Wallows
|--------------------------------------------------------------------------
*/
export async function artistSearchHandler(req: Request, res: Response) {
  try {
    // Extract the search query from the request URL (?q=...)
    const query = req.query.q as string;

    // If no query is provided, return a 400 Bad Request error
    if (!query) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    // Call the Setlist.fm service to search for artists by name
    const setlistArtists = await searchArtists(query);

    // This array will hold artists that are saved or retrieved from MongoDB
    const savedArtists: IArtist[] = [];

    // Loop through each artist returned from Setlist.fm
    for (const a of setlistArtists) {
      /*
        Prefer MusicBrainz ID (mbid) if available, since it is more stable.
        If mbid does not exist, fall back to Setlist.fm's artist ID.
      */
      const setlistFmId = a.mbid || a.id;

      // Check if this artist already exists in the database
      let artist = await Artist.findOne({ setlistFmId });

      // If the artist does not exist, create and save a new record
      if (!artist) {
        artist = new Artist({
          name: a.name,
          setlistFmId,
        });

        // Persist the new artist to MongoDB
        await artist.save();
      }

      // Add the artist (existing or newly created) to the response array
      savedArtists.push(artist);
    }

    // Return the saved artists to the client as JSON
    res.json(savedArtists);
  } catch (err: any) {
    // Log the error for debugging
    console.error(err);

    // Return a generic server error response
    res.status(500).json({ error: err.message });
  }
}

/*
|--------------------------------------------------------------------------
| Concerts by Artist Handler
|--------------------------------------------------------------------------
| This controller fetches concerts for a specific artist.
| It:
| 1. Receives an artist ID from the route parameter
| 2. Looks up the artist in MongoDB
| 3. Uses the artist's Setlist.fm ID to fetch concerts
| 4. Returns the concerts to the frontend
|
| Route example:
| GET /artists/:artistId/concerts
|--------------------------------------------------------------------------
*/
export async function concertsByArtistHandler(req: Request, res: Response) {
  try {
    // Extract the artist ID from the URL parameters
    const artistId = req.params.artistId;

    // Look up the artist in MongoDB by its ObjectId
    const artist = await Artist.findById(artistId);

    // If the artist does not exist, return a 404 Not Found error
    if (!artist) {
      return res.status(404).json({ error: "Artist not found" });
    }

    /*
      Use the artist's stored Setlist.fm ID to fetch concerts.
      This keeps external API logic out of the controller.
    */
    const concerts = await getConcertsByArtist(artist.setlistFmId);

    // Send the concerts back to the client
    res.json(concerts);
  } catch (err: any) {
    // Log any unexpected errors
    console.error(err);

    // Return a server error response
    res.status(500).json({ error: err.message });
  }
}
