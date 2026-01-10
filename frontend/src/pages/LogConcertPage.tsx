import React, { useState } from "react";
import ArtistSearch from "../components/ArtistSearch";
import ConcertSelector from "../components/ConcertSelector";
import PostForm from "../components/PostForm";

interface Artist {
  _id: string;
  name: string;
  setlistFmId: string;
}

interface Concert {
  _id: string;
  name: string;
  date: string;
}

const LogConcertPage: React.FC = () => {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);

  // Called when an artist is clicked
  const handleSelectArtist = async (artist: Artist) => {
    setSelectedArtist(artist);

    // Fetch concerts for this artist
    try {
      const res = await fetch(
        `http://localhost:4000/concerts/search?artistId=${artist.setlistFmId}`
      );
      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Invalid concerts data:", data);
        setConcerts([]);
        return;
      }

      setConcerts(data);
      setSelectedConcert(null); // Reset selected concert
    } catch (err) {
      console.error("Failed to fetch concerts:", err);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Log a Concert</h1>

      {/* Artist search */}
      <ArtistSearch onSelect={handleSelectArtist} />

      {/* Concert selection */}
      {concerts.length > 0 && (
        <ConcertSelector
          concerts={concerts}
          selectedConcert={selectedConcert}
          setSelectedConcert={setSelectedConcert}
        />
      )}

      {/* Post form */}
      {selectedConcert && <PostForm selectedConcert={selectedConcert} />}
    </div>
  );
};

export default LogConcertPage;
