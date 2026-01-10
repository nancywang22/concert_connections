import fetch from "node-fetch";

const API_KEY = process.env.SETLISTFM_API_KEY;
const BASE_URL = "https://api.setlist.fm/rest/1.0";

export async function searchArtists(query: string) {
  if (!API_KEY) throw new Error("SETLISTFM_API_KEY not set in .env");

  const res = await fetch(`${BASE_URL}/search/artists?artistName=${encodeURIComponent(query)}`, {
    headers: {
      Accept: "application/json",
      "x-api-key": API_KEY,
    },
  });

  if (!res.ok) throw new Error(`Setlist.fm API error: ${res.statusText}`);
  const data = await res.json();
  // Return array of artists (simplified)
  return data.artist || [];
}


/*Fetches artist data

Throws error if API fails

Returns array of artist objects*/