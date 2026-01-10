import fetch from "node-fetch";

const SETLISTFM_API_KEY = process.env.SETLISTFM_API_KEY;
const BASE_URL = "https://api.setlist.fm/rest/1.0";

if (!SETLISTFM_API_KEY) {
  throw new Error("SETLISTFM_API_KEY not set in .env");
}

// Search artists by name
export async function searchArtists(query: string) {
  const response = await fetch(`${BASE_URL}/search/artists?artistName=${encodeURIComponent(query)}`, {
    headers: {
      "x-api-key": SETLISTFM_API_KEY!,
      Accept: "application/json",
    },
  });

  const data = await response.json();
  // Return simplified list
  return data.artist || [];
}

// Get concerts (setlists) for an artist by Setlist.fm ID
export async function getConcertsForArtist(setlistFmId: string) {
  const response = await fetch(`${BASE_URL}/artist/${setlistFmId}/setlists`, {
    headers: {
      "x-api-key": SETLISTFM_API_KEY!,
      Accept: "application/json",
    },
  });

  const data = await response.json();
  return data.setlist || [];
}



/*Fetches artist data

Throws error if API fails

Returns array of artist objects*/