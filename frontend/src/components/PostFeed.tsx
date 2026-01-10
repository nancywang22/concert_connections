/*import React from "react";

interface Post {
  _id: string;
  userId: string;
  caption: string;
  imageUrl: string;
  createdAt: string;
}

interface Props {
  posts: Post[];
}

const PostFeed: React.FC<Props> = ({ posts }) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post._id} className="border rounded p-2">
          <img src={post.imageUrl} alt="Post" className="w-full rounded" />
          <p className="mt-2">{post.caption}</p>
          <small className="text-gray-500">{new Date(post.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

export default PostFeed;*/

import PostCard from "./PostCard";

export default function PostFeed({ posts }: { posts: any[] }) {
  if (!posts.length) return <p>No posts yet</p>;

  return (
    <div>
      {posts.map(post => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}

