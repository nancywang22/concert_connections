import React, { useEffect, useState } from "react";

// Type definitions for Post, Concert, and User
interface Concert {
  _id: string;
  name: string;
  date: string;
  city: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
}

interface Post {
  _id: string;
  caption: string;
  imageUrl?: string;
  user: User;       // Reference to User who made the post
  concert: Concert; // Reference to Concert the post is about
}

const MainPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch posts from backend
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/posts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: Post[] = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Backend fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Concert Posts</h1>

      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts yet. Log a concert to get started!</p>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            className="border p-4 rounded shadow bg-white flex flex-col space-y-2"
          >
            {/* Concert Info */}
            <div className="text-lg font-semibold">
              {post.concert.name}{" "}
              <span className="text-sm text-gray-500">
                ({post.concert.city}, {post.concert.date})
              </span>
            </div>

            {/* Caption */}
            <p>{post.caption}</p>

            {/* Image */}
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="concert post"
                className="rounded h-full w-full object-cover"
              />
            )}

            {/* User Info */}
            <p className="text-sm text-gray-500 mt-1">
              by {post.user.username} ({post.user.email})
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default MainPage;
