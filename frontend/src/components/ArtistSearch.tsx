import React, { useState } from "react";

interface Artist {
  _id: string;
  name: string;
  setlistFmId: string;
}

interface ArtistSearchProps {
  artists: Artist[];
  setArtists: (artists: Artist[]) => void;
  onSelect: (artist: Artist) => void;
}

const ArtistSearch: React.FC<ArtistSearchProps> = ({ artists, setArtists, onSelect }) => {
  const [query, setQuery] = useState("");

  /**
   * Search artists from backend
   */
  const searchArtists = async () => {
    if (!query) return;
    try {
      const res = await fetch(`http://localhost:4000/artists/search?q=${query}`);
      const data = await res.json();
      setArtists(data); // set artists to display
    } catch (err) {
      console.error("Error searching artists:", err);
    }
  };

  return (
    <div className="space-y-2">
      <h2 className="font-semibold">Artist</h2>

      <div className="flex gap-2">
        <input
          className="border p-2 flex-1"
          placeholder="Search artist..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="border px-4"
          onClick={searchArtists}
        >
          Search
        </button>
      </div>

      {/* Display results */}
      {artists.map((artist) => (
        <div
          key={artist._id}
          className="cursor-pointer p-2 border rounded hover:bg-gray-100"
          onClick={() => onSelect(artist)}
        >
          {artist.name}
        </div>
      ))}
    </div>
  );
};

export default ArtistSearch;
