import { useEffect, useState } from "react";
import { fetchMainPage } from "../services/api";
import ConcertSelector from "../components/ConcertSelector";
import SetlistSidebar from "../components/SetlistSidebar";
import PostFeed from "../components/PostFeed";

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

interface Post {
  _id: string;
  user: { username: string };
  imageUrl: string;
  caption: string;
  createdAt: string;
}

export default function MainPage() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from backend
  const loadMainPage = async (concertId?: string) => {
    setLoading(true);
    const data = await fetchMainPage(concertId);
    setConcerts(data.concerts || []);
    setSelectedConcert(data.selectedConcert || null);
    setPosts(data.posts || []);
    setLoading(false);
  };

  useEffect(() => {
    loadMainPage();
  }, []);

  const handleConcertChange = (concertId: string) => {
    loadMainPage(concertId);
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="flex h-screen">
      {/* Left: Setlist */}
      <div className="w-1/4 border-r p-4 overflow-y-auto">
        {selectedConcert ? (
          <SetlistSidebar concert={selectedConcert} />
        ) : (
          <div>Select a concert to see the setlist</div>
        )}
      </div>

      {/* Right: Main feed */}
      <div className="flex-1 p-4 overflow-y-auto">
        <ConcertSelector
          concerts={concerts}
          selectedConcert={selectedConcert}
          onChange={handleConcertChange}
        />
        <PostFeed posts={posts} />
      </div>
    </div>
  );
}

/*Fetches all user concerts on load

Updates selected concert and posts when a concert is selected

Uses flex layout: left sidebar for setlist, right for posts */