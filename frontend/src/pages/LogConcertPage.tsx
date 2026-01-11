import React, { useState } from "react";
import PostForm from "../components/PostForm";
import { formatDate } from "../utils/formatDate";
import { parseConcertDate } from "../utils/formatDate";
const API_URL = "https://concert-connections.onrender.com";

// Artist and Concert interfaces
interface Artist {
  _id: string;
  name: string;
  setlistFmId: string;
}

interface Concert {
  id: string;
  artistName: string;
  eventDate: string;
  venueName: string;
  cityName: string;
}

const LogConcertPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  /* ---------------- Search artists ---------------- */
  const searchArtists = async () => {
    if (!query) return;
    try {
      const res = await fetch(
        `${API_URL}/artists/search?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setArtists(data);
      setConcerts([]);
      setSelectedConcert(null);
    } catch (err) {
      console.error("Artist search error:", err);
    }
  };

  /* ---------------- Select artist ---------------- */
  const selectArtist = async (artist: Artist) => {
    setSelectedArtist(artist);
    setArtists([]);
    setQuery("");
    setSelectedConcert(null);

    try {
      const res = await fetch(`${API_URL}/artists/${artist._id}/concerts`);
      const data = await res.json();

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

  /* ---------------- Change handlers ---------------- */
  const changeArtist = () => {
    setSelectedArtist(null);
    setSelectedConcert(null);
    setConcerts([]);
    setArtists([]);
  };

  const changeConcert = () => {
    setSelectedConcert(null);
  };

  /* ---------------- Date filtering ---------------- */
  const filteredConcerts = concerts.filter((concert) => {
  const concertDate = parseConcertDate(concert.eventDate);

  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  if (start && concertDate < start) return false;
  if (end && concertDate > end) return false;

  return true;
});

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Log a Concert</h1>

      {/* ================= ARTIST ================= */}
      {!selectedArtist ? (
        <>
          <div className="space-y-2">
            <input
              className="border p-2 w-full"
              placeholder="Search artist..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              onClick={searchArtists}
              className="px-4 py-2 border rounded bg-blue-500 text-white"
            >
              Search
            </button>
          </div>

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
        </>
      ) : (
        <div className="flex items-center justify-between p-3 border rounded bg-blue-50">
          <span>
            <strong>Artist:</strong> {selectedArtist.name}
          </span>
          <button
            onClick={changeArtist}
            className="text-sm text-blue-600 underline"
          >
            Change
          </button>
        </div>
      )}


      {selectedArtist && concerts.length > 0 && (
  <div className="flex gap-2 mt-4">
    <input
      type="date"
      className="border p-2 rounded"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
    />
    <input
      type="date"
      className="border p-2 rounded"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
    />
  </div>
)}

      {/* ================= CONCERT ================= */}
      {selectedArtist && !selectedConcert && concerts.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold text-lg">
            Concerts for {selectedArtist.name}
          </h2>
          <div className="space-y-1 mt-2">
            {filteredConcerts.map((concert) => (
              <div
                key={concert.id}
                className="p-2 border rounded cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedConcert(concert)}
              >
                {formatDate(concert.eventDate)} – {concert.venueName},{" "}
                {concert.cityName}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedConcert && (
        <div className="flex items-center justify-between p-3 border rounded bg-green-50">
          <span>
            <strong>Concert:</strong>{" "}
            {formatDate(selectedConcert.eventDate)} – {selectedConcert.venueName},{" "}
            {selectedConcert.cityName}
          </span>
          <button
            onClick={changeConcert}
            className="text-sm text-green-700 underline"
          >
            Change
          </button>
        </div>
      )}

      {/* ================= POST FORM ================= */}
      {selectedArtist && selectedConcert && (
        <div className="mt-4">
          <h2 className="font-semibold text-lg">
            Create Post for {selectedConcert.venueName}
          </h2>
          <PostForm
            selectedConcert={selectedConcert}
            artistName={selectedArtist.name}
          />
        </div>
      )}
    </div>
  );
};

export default LogConcertPage;
