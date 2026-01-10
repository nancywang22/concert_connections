import React from "react";

interface Artist {
  name: string;
  setlistFmId: string;
}

interface Concert {
  _id: string;
  artist: Artist;
  setlist?: string[]; // optional, may fetch separately
}

interface Props {
  concert: Concert;
}

export default function SetlistSidebar({ concert }: Props) {
  // For now, let's show dummy songs; later you can fetch from backend
  const setlist = concert.setlist || ["Song 1", "Song 2", "Song 3"];

  return (
    <div>
      <h2 className="font-bold text-lg mb-2">{concert.artist.name} Setlist</h2>
      <ul className="list-disc pl-4">
        {setlist.map((song, idx) => (
          <li key={idx}>{song}</li>
        ))}
      </ul>
    </div>
  );
}
