import React from "react";

interface Post {
  _id: string;
  user: { username: string };
  imageUrl: string;
  caption: string;
  createdAt: string;
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <div className="border rounded mb-4 p-2">
      <div className="font-semibold">{post.user.username}</div>
      <img src={post.imageUrl} alt="Post" className="w-full mt-2 rounded" />
      <p className="mt-1">{post.caption}</p>
      <small className="text-gray-500">{new Date(post.createdAt).toLocaleString()}</small>
    </div>
  );
}
