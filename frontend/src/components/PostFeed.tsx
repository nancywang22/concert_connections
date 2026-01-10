import React from "react";
import PostCard from "./PostCard";

interface Post {
  _id: string;
  user: { username: string };
  imageUrl: string;
  caption: string;
  createdAt: string;
}

export default function PostFeed({ posts }: { posts: Post[] }) {
  if (!posts.length) return <div>No posts yet for this concert.</div>;
  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
