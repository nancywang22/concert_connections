import React from "react";

interface Artist {
  name: string;
  setlistFmId: string;
}

interface Concert {
  _id: string;
  date?: string;
  city?: string;
  artist: Artist;
}

interface Props {
  concerts: Concert[];
  selectedConcert: Concert | null;
  onChange: (concertId: string) => void;
}

export default function ConcertSelector({ concerts, selectedConcert, onChange }: Props) {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-semibold">Select Concert:</label>
      <select
        className="w-full border rounded p-2"
        value={selectedConcert?._id || ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">-- Select --</option>
        {concerts.map((concert) => (
          <option key={concert._id} value={concert._id}>
            {concert.artist.name} - {concert.city || "Unknown City"} ({concert.date || "Unknown Date"})
          </option>
        ))}
      </select>
    </div>
  );
}

/*Dropdown lets user pick a concert

Calls onChange to reload posts + setlist */