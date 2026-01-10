import { useState } from "react";

export default function ConcertSearch({ artist, onSelect }: any) {
  const [city, setCity] = useState("");
  const [concerts, setConcerts] = useState<any[]>([]);

  const searchConcerts = async () => {
    const res = await fetch(
      `http://localhost:4000/concerts/search?artistId=${artist.setlistFmId}&city=${city}`
    );
    const data = await res.json();
    setConcerts(Array.isArray(data.concerts) ? data.concerts : []);

  };

  return (
    <div className="space-y-2">
      <h2 className="font-semibold">Concert</h2>

      <div className="flex gap-2">
        <input
          className="border p-2 flex-1"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={searchConcerts} className="border px-4">
          Search
        </button>
      </div>

      {concerts.map((concert) => (
        <div
          key={concert.setlistFmId}
          onClick={() => onSelect(concert)}
          className="cursor-pointer p-2 border rounded hover:bg-gray-100"
        >
          {concert.venue.name} — {concert.eventDate}
        </div>
      ))}
    </div>
  );
}
