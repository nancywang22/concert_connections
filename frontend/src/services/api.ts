// src/services/api.ts
// ------------------------
// API service for Concert Connections
// Handles fetching posts, searching artists, and logging posts
// ------------------------

// Toggle between local and deployed backend
// const API_URL = "http://localhost:4000"; // for local development
const API_URL = "https://concert-connections.onrender.com"; // deployed backend

// ------------------------
// Fetch main page posts
// Optionally filter by concert ID
// ------------------------
export async function fetchMainPage(concertId?: string) {
  try {
    const url = concertId ? `${API_URL}/main?concertId=${concertId}` : `${API_URL}/main`;
    const res = await fetch(url, { 
      credentials: "include" // optional, if using cookies
    });
    if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
    return res.json();
  } catch (err) {
    console.error("fetchMainPage error:", err);
    throw err;
  }
}

// ------------------------
// Search for artists
// ------------------------
export async function fetchArtists(query: string) {
  try {
    if (!query) return [];

    const token = localStorage.getItem("token"); // JWT from login

    // Backend expects query param 'q', not 'query'
    const res = await fetch(`${API_URL}/artists/search?q=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "", // include token if available
      },
    });

    if (!res.ok) {
      const errText = await res.text(); // sometimes backend returns plain text
      throw new Error(`Artist search failed: ${res.status} ${errText}`);
    }

    return res.json(); // should be array of artists
  } catch (err) {
    console.error("fetchArtists error:", err);
    return [];
  }
}

// ------------------------
// Log a post for a concert
// ------------------------
export async function logPost(concertId: string, imageUrl: string, caption: string) {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User must be logged in");

    const res = await fetch(`${API_URL}/posts/log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ concertId, imageUrl, caption }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to log post");
    }

    return data;
  } catch (err) {
    console.error("logPost error:", err);
    throw err;
  }
}
