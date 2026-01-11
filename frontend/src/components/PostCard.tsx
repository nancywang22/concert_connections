
export default function PostCard({ post }: { post: any }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <img
        src={post.imageUrl}
        alt=""
        style={{ width: "100%", maxHeight: 400, objectFit: "cover" }}
      />
      <p>
        <strong>{post.user?.username}</strong> {post.caption}
      </p>
    </div>
  );
}

