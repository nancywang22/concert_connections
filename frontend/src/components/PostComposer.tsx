import { useState } from "react";

export default function PostComposer({ concert }: any) {
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const submitPost = async () => {
    await fetch("http://localhost:4000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        concert,
        caption,
        imageUrl,
      }),
    });

    alert("Concert logged!");
  };

  return (
    <div className="space-y-2 border-t pt-4">
      <h2 className="font-semibold">Create Post</h2>

      <input
        className="border p-2 w-full"
        placeholder="Image URL (temporary)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <textarea
        className="border p-2 w-full"
        placeholder="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />

      <button onClick={submitPost} className="border px-4 py-2">
        Post
      </button>
    </div>
  );
}
