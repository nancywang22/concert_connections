import fetch from "node-fetch";

const SETLISTFM_API_KEY = process.env.SETLISTFM_API_KEY;

// ---------------------------
// Search artists by name
// ---------------------------

// This function searches Setlist.fm for artists that match a given query string.
export async function searchArtists(query: string) {
  // It constructs the API URL using the query and page number (p=1 for first page).
  const url = `https://api.setlist.fm/rest/1.0/search/artists?artistName=${encodeURIComponent(query)}&p=1`;

  // A GET request is made with the API key included in the headers for authentication.
  const res = await fetch(url, {
    headers: {
      "x-api-key": SETLISTFM_API_KEY || "",
      Accept: "application/json",
    },
  });

  // throws error if response not ok
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Setlist.fm API error: ${res.status} - ${text}`);
  }

  // On success, the response is parsed as JSON and the function returns an array of
  // artists from data.artist. If no artists are found, it returns an empty array.
  const data = await res.json();
  return data.artist || []; // returns array of artists
}

// ---------------------------
// Get concerts (setlists) by artist
// ---------------------------
// This function fetches the setlists (concerts) for a specific artist using their
// Setlist.fm ID (setlistFmId).

//

export async function getConcertsByArtist(setlistFmId: string) {
  const url = `https://api.setlist.fm/rest/1.0/artist/${setlistFmId}/setlists?p=1`;

  const res = await fetch(url, {
    headers: {
      "x-api-key": SETLISTFM_API_KEY || "",
      Accept: "application/json",
    },
  });

  // throws error if response not ok
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Setlist.fm API error: ${res.status} - ${text}`);
  }
  
  // On success, it parses the JSON response and returns an array of concerts
  // from data.setlist. If no concerts are found, it returns an empty array.
  const data = await res.json();
  return data.setlist || []; // returns array of concerts
}
