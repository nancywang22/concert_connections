import React, { useState } from "react";
import PostForm from "../components/PostForm";
const API_URL = "https://concert-connections.onrender.com"; // your backend
// Artist and Concert interfaces
interface Artist {
  _id: string;
  name: string;
  setlistFmId: string;
}

interface Concert {
  id: string; // Setlist.fm ID
  artistName: string;
  eventDate: string;
  venueName: string;
  cityName: string;
}

const LogConcertPage: React.FC = () => {
  // ------------------------
  // State
  // ------------------------
  const [query, setQuery] = useState(""); // search input
  const [artists, setArtists] = useState<Artist[]>([]); // search results
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [concerts, setConcerts] = useState<Concert[]>([]); // concerts for selected artist
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);

  // ------------------------
  // Search artists
  // ------------------------
  const searchArtists = async () => {
    if (!query) return;
    try {
      const res = await fetch(`${API_URL}/artists/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setArtists(data);
      setSelectedArtist(null);
      setConcerts([]);
      setSelectedConcert(null);
    } catch (err) {
      console.error("Artist search error:", err);
    }
  };

  // ------------------------
  // Click artist → fetch concerts
  // ------------------------
  const selectArtist = async (artist: Artist) => {
    setSelectedArtist(artist);
    setSelectedConcert(null);

    try {
      const res = await fetch(`${API_URL}/artists/${artist._id}/concerts`);
      const data = await res.json();

      // Map concerts to our Concert interface
      const concertsMapped: Concert[] = (data || []).map((c: any) => ({
        id: c.id,
        eventDate: c.eventDate,
        venueName: c.venue?.name || "Unknown venue",
        cityName: c.venue?.city?.name || "Unknown city",
      }));

      setConcerts(concertsMapped);
    } catch (err) {
      console.error("Fetching concerts error:", err);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Log a Concert</h1>

      {/* ------------------------ */}
      {/* Artist Search */}
      {/* ------------------------ */}
      <div className="space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="Search artist..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={searchArtists} className="px-4 py-2 border rounded bg-blue-500 text-white">
          Search
        </button>
      </div>

      {/* Artist results */}
      {artists.length > 0 && (
        <div className="space-y-1 mt-2">
          {artists.map((artist) => (
            <div
              key={artist._id}
              className="p-2 border rounded cursor-pointer hover:bg-gray-100"
              onClick={() => selectArtist(artist)}
            >
              {artist.name}
            </div>
          ))}
        </div>
      )}

      {/* ------------------------ */}
      {/* Concerts for selected artist */}
      {/* ------------------------ */}
      {selectedArtist && concerts.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold text-lg">Concerts for {selectedArtist.name}</h2>
          <div className="space-y-1 mt-2">
            {concerts.map((concert) => (
              <div
                key={concert.id}
                className={`p-2 border rounded cursor-pointer hover:bg-gray-100 ${
                  selectedConcert?.id === concert.id ? "bg-blue-100" : ""
                }`}
                onClick={() => setSelectedConcert(concert)}
              >
                {concert.eventDate} - {concert.venueName}, {concert.cityName}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------ */}
      {/* Post form for selected concert */}
      {/* ------------------------ */}
      {selectedConcert && selectedArtist && (
        <div className="mt-4">
          <h2 className="font-semibold text-lg">Create Post for {selectedConcert.venueName}</h2>
          <PostForm selectedConcert={selectedConcert} artistName={selectedArtist.name} />
        </div>
      )}
    </div>
  );
};

export default LogConcertPage;
