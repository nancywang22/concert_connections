//const API_URL = "http://localhost:4000"; // your backend
const API_URL = "https://concert-connections.onrender.com"; // your backend

export async function fetchMainPage(concertId?: string) {
  const url = concertId ? `${API_URL}/main?concertId=${concertId}` : `${API_URL}/main`;
  const res = await fetch(url, { credentials: "include" }); // optional: for auth cookies
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export async function fetchArtists(query: string) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/artists/search?query=${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function logPost(concertId: string, imageUrl: string, caption: string) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/posts/log`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    //body: JSON.stringify(FormData),
    body: JSON.stringify({ concertId, imageUrl, caption }),
  });
  return res.json();
}
