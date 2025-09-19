// BooksPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./BooksPage.css";

/*
 Props:
  - isLoggedIn (bool) optional; if false it will redirect to /login
  - images (object) optional: { synapse: "/images/books/synapse.jpg", ... }
*/
export default function BooksPage({ isLoggedIn = true, images = {} }) {
  const navigate = useNavigate();

  const cards = [
    { id: "synapse", title: "سیناپس", img: images.synapse ||  "/images/books/synapse.jpg" },
    { id: "kaplan", title: "کامپرهنسیو کاپلان", img: images.kaplan || "/images/books/kaplan.jpg" },
    { id: "gabard", title: "گابارد", img: images.gabard || "/images/books/gabard.jpg" },
    { id: "bek", title: "بک", img: images.bek || "/images/books/bek.jpg" },
    { id: "tasman", title: "تاسمن", img: images.tasman || "/images/books/tasman.jpg" },
    { id: "country", title: "دستورالعمل های کشوری", img: images.country || "/images/books/placeholder6.jpg" },
  ];

  // Guard: if not logged in send to /login
  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  return (
    <div className="books-wrap">
      <div className="books-window" role="main" aria-label="Books main page">
        <div className="books-grid" aria-live="polite">
          {cards.map((c) => (
            <div
              key={c.id}
              className="book-card"
              role="button"
              tabIndex={0}
              aria-label={`Open ${c.title}`}
              onClick={() => {
                if (c.id === "kaplan") {
                  navigate("/cards");
                } else {
                  navigate(`/books/${c.id}`);
               }
              }}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") navigate(`/books/${c.id}`); }}
            >
              <div className="card-media" style={{ backgroundImage: `url(${c.img})` }} aria-hidden="true" />
              <div className="card-caption">{c.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
