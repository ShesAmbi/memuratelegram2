// BooksDetail.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function BooksDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: 24 }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 18 }}>← Back</button>
      <h1 style={{ color: "#FFD66A" }}>صفحه: {id}</h1>
      <p style={{ color: "#ccc" }}>اینجا محتوای توضیح برای کارت <strong>{id}</strong> نمایش داده خواهد شد.</p>
    </div>
  );
}
