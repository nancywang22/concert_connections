import React, { useState } from "react";

interface Concert {
  _id: string;
  name: string;
  date: string;
}

interface Props {
  selectedConcert: Concert;
}

const PostForm: React.FC<Props> = ({ selectedConcert }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return alert("Please select an image");

    const formData = new FormData();
    formData.append("concertId", selectedConcert._id);
    formData.append("caption", caption);
    formData.append("image", image);

    try {
      const res = await fetch("http://localhost:4000/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to submit post");

      alert("Post created!");
      setCaption("");
      setImage(null);
    } catch (err) {
      console.error(err);
      alert("Error creating post");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded space-y-4">
      <h2 className="font-semibold text-lg">Add Your Post</h2>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files && setImage(e.target.files[0])}
      />
      <textarea
        className="border p-2 w-full rounded"
        placeholder="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
};

export default PostForm;
