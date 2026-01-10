import { useEffect, useState } from "react";

interface SetlistSong {
  name: string;
}

export default function SetlistSidebar() {
  const [songs, setSongs] = useState<SetlistSong[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSetlist = async () => {
      try {
        // TEMP: hardcoded concertId (we’ll remove this later)
        const concertId = localStorage.getItem("activeConcertId");

        if (!concertId) {
          setLoading(false);
          return;
        }

        const res = await fetch(
          `http://localhost:4000/concerts/${concertId}`
        );
        const data = await res.json();

        setSongs(data.setlist || []);
      } catch (err) {
        console.error("Setlist fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSetlist();
  }, []);

  if (loading) return <p>Loading setlist...</p>;

  if (songs.length === 0) {
    return <p className="text-sm text-gray-500">No setlist available</p>;
  }

  return (
    <div className="border rounded p-4 bg-white shadow">
      <h2 className="font-semibold mb-2">Setlist</h2>
      <ul className="text-sm space-y-1">
        {songs.map((song, i) => (
          <li key={i}>
            {i + 1}. {song.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
