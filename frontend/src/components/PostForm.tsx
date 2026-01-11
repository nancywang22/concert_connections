import React, { useState } from "react";

// Props for selected concert
interface Concert {
  //id: string; // Setlist.fm concert ID
  artistName: string;
  eventDate: string;
  venueName: string;
  cityName: string;
}

interface PostFormProps {
  selectedConcert: Concert;
  artistName:string;
}

const PostForm: React.FC<PostFormProps> = ({ selectedConcert, artistName }: PostFormProps) => {
  // ------------------------
  // Local state
  // ------------------------
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // ------------------------
  // Handle form submission
  // ------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const token = localStorage.getItem("token"); // JWT from login
    if (!token) {
      setError("You must be logged in to post.");
      return;
    }

    // Must include caption or image
    if (!caption && !imageUrl) {
      setError("Please add a caption or image URL.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/concerts/log", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  body: JSON.stringify({
    artistName,
    city: selectedConcert.cityName,
    date: selectedConcert.eventDate,
    venue: selectedConcert.venueName,
    caption,
    imageUrl,
  }),
});

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create post");
      }

      // Success!
      setSuccess(true);
      setCaption("");
      setImageUrl("");
    } catch (err: any) {
      console.error("Post submission error:", err);
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border p-4 rounded bg-white shadow">
      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">Post created successfully!</p>}

      <div>
        <label className="block font-semibold mb-1">Caption</label>
        <textarea
          className="border p-2 w-full rounded"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write something about this concert..."
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Image URL</label>
        <input
          type="text"
          className="border p-2 w-full rounded"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Optional image URL"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
};

export default PostForm;
