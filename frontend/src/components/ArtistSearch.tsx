import { useState } from "react";

interface Artist {
  _id: string;
  name: string;
  setlistFmId: string;
}

interface ArtistSearchProps {
  onSelect: (artist: Artist) => void;
}

export default function ArtistSearch({ onSelect }: ArtistSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Artist[]>([]);

  const searchArtists = async () => {
    if (!query) return;

    try {
      const res = await fetch(
        `http://localhost:4000/artists/search?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Backend returned invalid data:", data);
        setResults([]);
        return;
      }

      setResults(data);
    } catch (err) {
      console.error("Search failed:", err);
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
        <button onClick={searchArtists} className="border px-4">
          Search
        </button>
      </div>

      {results.map((artist) => (
        <div
          key={artist.setlistFmId}
          onClick={() => onSelect(artist)}
          className="cursor-pointer p-2 border rounded hover:bg-gray-100"
        >
          {artist.name}
        </div>
      ))}
    </div>
  );
}
