// Base URL for the backend API. All fetch calls will use this as the root.
const API_URL = "https://concert-connections.onrender.com";

// ---------------------------
// Fetch main page data
// ---------------------------
// Optional parameter: concertId, if you want data for a specific concert
export async function fetchMainPage(concertId?: string) {
  // Build the URL depending on whether a specific concert is requested
  const url = concertId ? `${API_URL}/main?concertId=${concertId}` : `${API_URL}/main`;

  // Make a fetch request to the backend
  // `credentials: "include"` allows sending cookies with the request if your backend uses them for authentication
  const res = await fetch(url, { credentials: "include" });

  // If the response is not OK (e.g., 4xx or 5xx status), throw an error
  if (!res.ok) throw new Error("Failed to fetch");

  // Parse the response JSON and return it
  return res.json();
}

// ---------------------------
// Search for artists by query
// ---------------------------
export async function fetchArtists(query: string) {
  // Get the JWT token stored in localStorage to authorize the request
  const token = localStorage.getItem("token");

  // Make a GET request to the backend search endpoint
  const res = await fetch(`${API_URL}/artists/search?query=${query}`, {
    headers: { Authorization: `Bearer ${token}` }, // Send token in Authorization header
  });

  // Parse and return the JSON response
  return res.json();
}

// ---------------------------
// Log a post for a concert
// ---------------------------
export async function logPost(concertId: string, imageUrl: string, caption: string) {
  // Get the JWT token from localStorage for authentication
  const token = localStorage.getItem("token");

  // Send a POST request to the backend to create a new post
  const res = await fetch(`${API_URL}/posts/log`, {
    method: "POST", // POST method since we are creating a resource
    headers: {
      "Content-Type": "application/json", // Tell the server we are sending JSON
      Authorization: `Bearer ${token}`,     // Include JWT for authentication
    },
    // Send the post data as JSON in the request body
    body: JSON.stringify({ concertId, imageUrl, caption }),
  });

  // Parse and return the JSON response from the server
  return res.json();
}
