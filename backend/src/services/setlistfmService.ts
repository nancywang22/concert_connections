import fetch from "node-fetch";

const SETLISTFM_API_KEY = process.env.SETLISTFM_API_KEY;

// ---------------------------
// Search artists by name
// ---------------------------
export async function searchArtists(query: string) {
  const url = `https://api.setlist.fm/rest/1.0/search/artists?artistName=${encodeURIComponent(query)}&p=1`;

  const res = await fetch(url, {
    headers: {
      "x-api-key": SETLISTFM_API_KEY || "",
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Setlist.fm API error: ${res.status} - ${text}`);
  }

  const data = await res.json();
  return data.artist || []; // returns array of artists
}

// ---------------------------
// Get concerts (setlists) by artist mbid
// ---------------------------
export async function getConcertsByArtist(setlistFmId: string) {
  const url = `https://api.setlist.fm/rest/1.0/artist/${setlistFmId}/setlists?p=1`;

  const res = await fetch(url, {
    headers: {
      "x-api-key": SETLISTFM_API_KEY || "",
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Setlist.fm API error: ${res.status} - ${text}`);
  }

  const data = await res.json();
  return data.setlist || []; // returns array of setlists
}
