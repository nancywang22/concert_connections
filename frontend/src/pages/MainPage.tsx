import React, { useEffect, useState } from "react";
import SetlistSidebar from "../components/SetlistSidebar";

interface Post {
  _id: string;
  concertName: string;
  caption: string;
  imageUrl: string;
  userName: string;
}

const MainPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:4000/posts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Backend fetch error:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="flex gap-6">
      {/* LEFT: Setlist */}
      <div className="w-64">
        <SetlistSidebar />
      </div>

      {/* RIGHT: Posts (your original code) */}
      <div className="flex-1 space-y-6">
        <h1 className="text-2xl font-bold">Concert Posts</h1>

        {posts.length === 0 ? (
          <p>No posts yet</p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="border p-4 rounded bg-white shadow"
            >
              <h2 className="font-semibold">{post.concertName}</h2>
              <p>{post.caption}</p>

              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="concert post"
                  className="mt-2 rounded max-h-64 w-full object-cover"
                />
              )}

              <p className="text-sm text-gray-500 mt-1">
                by {post.userName}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MainPage;
