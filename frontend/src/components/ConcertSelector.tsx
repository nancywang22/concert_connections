// src/components/ConcertSelector.tsx
import React from "react";

export interface Concert {
  _id: string;
  name: string;
  date: string;
}

interface ConcertSelectorProps {
  concerts: Concert[];
  selectedConcert: Concert | null;
  setSelectedConcert: (concert: Concert) => void;
}

export default function ConcertSelector({
  concerts,
  selectedConcert,
  setSelectedConcert,
}: ConcertSelectorProps) {
  return (
    <div className="space-y-2">
      <h2 className="font-semibold">Select a Concert</h2>
      {concerts.length === 0 && <p>No concerts found.</p>}
      {concerts.map((concert) => (
        <div
          key={concert._id}
          className={`cursor-pointer p-2 border rounded ${
            selectedConcert?._id === concert._id ? "bg-blue-100" : ""
          }`}
          onClick={() => setSelectedConcert(concert)}
        >
          {concert.name} - {concert.date}
        </div>
      ))}
    </div>
  );
}
