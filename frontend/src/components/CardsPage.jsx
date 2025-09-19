import React, { useEffect, useState } from "react";
import "./CardsPage.css";

/*
 Props:
  - topicId (number) : which topic to load (default 1)
  - telegramUserId (number|string) : REQUIRED for marking (replace with real telegram user id)
*/


export default function CardsPage({ topicId = 1, telegramUserId = null }) {
  const CARDS_API = `https://memurahardcoded.pages.dev/api/topics/${topicId}/cards/`;
  const TOGGLE_MARK_API = `https://memurahardcoded.pages.dev/api/marks/toggle/`;
  const GET_MARKS_API = `https://memurahardcoded.pages.dev/api/marks/?user_id=${telegramUserId}`;
  const token = localStorage.getItem("token");
  fetch(`https://memurahardcoded.pages.dev/api/topics/${topicId}/cards/`, {
     headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
  })


  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [feedback, setFeedback] = useState(null); // { ok: bool, text: string }
  const [markedIds, setMarkedIds] = useState(new Set());
  const [explanationVisible, setExplanationVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch cards on mount or when topicId changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(CARDS_API)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load cards");
        return r.json();
      })
      .then((data) => {
        setCards(data);
        setIndex(0);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [CARDS_API]);

  // try to fetch marked cards for this user (optional; if your backend doesn't expose this, it will silently fail)
  useEffect(() => {
    if (!telegramUserId) return;
    fetch(GET_MARKS_API)
      .then((r) => {
        if (!r.ok) throw new Error("No marks endpoint");
        return r.json();
      })
      .then((data) => {
        // expect data = list of marks with 'card' field or list of card ids
        const ids = new Set();
        if (Array.isArray(data)) {
          data.forEach((m) => {
            if (typeof m === "number") ids.add(m);
            else if (m.card) ids.add(m.card);
          });
        }
        setMarkedIds(ids);
      })
      .catch(() => {
        // ignore: backend might not provide this endpoint
      });
  }, [GET_MARKS_API, telegramUserId]);

  const currentCard = cards[index] || null;

  function handlePrev() {
    if (!cards.length) return;
    const next = index === 0 ? cards.length - 1 : index - 1;
    setIndex(next);
    resetAnswerState();
  }
  function handleNext() {
    if (!cards.length) return;
    const next = index === cards.length - 1 ? 0 : index + 1;
    setIndex(next);
    resetAnswerState();
  }
  function resetAnswerState() {
    setSelectedChoice(null);
    setFeedback(null);
  }

  function handleChoice(choiceIndex) {
    if (!currentCard) return;
    setSelectedChoice(choiceIndex);
    const ok = choiceIndex === currentCard.correct_index;
    setFeedback({
      ok,
      text: ok ? "Correct ✔" : "Incorrect ✖",
      explanation: currentCard.explanation || "",
    });
  }

  async function handleToggleMark() {
    if (!telegramUserId) {
      alert("Telegram user id not provided. Marking requires user id.");
      return;
    }
    if (!currentCard) return;
    try {
      const res = await fetch(TOGGLE_MARK_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: telegramUserId, card_id: currentCard.id }),
        // credentials: 'include' // uncomment if your API needs cookies/session
      });
      const data = await res.json();
      if (res.ok) {
        setMarkedIds((prev) => {
          const copy = new Set(prev);
          if (data.status === "marked") copy.add(currentCard.id);
          else copy.delete(currentCard.id);
          return copy;
        });
      } else {
        alert(data.detail || "Failed to toggle mark");
      }
    } catch (e) {
      alert("Network error while toggling mark");
    }
  }

  function openExplanation() {
    setExplanationVisible(true);
    // keep feedback state as is
  }
  function closeExplanation() {
    setExplanationVisible(false);
  }

  // UI shortcuts
  const isMarked = currentCard && markedIds.has(currentCard.id);

  return (
    <div className="cards-page">
      <div className="card-frame"> {/* colored margin wrapper */}
        {/* Explanation panel (left half) */}
        <div className={`explanation-window ${explanationVisible ? "visible" : ""}`}>
          {currentCard ? (
            <div className="explain-inner">
              <h3 className="explain-title">توضیح کامل</h3>
              <div className="explain-text">{currentCard.explanation || "بدون توضیح."}</div>
              <button className="btn back-btn" onClick={closeExplanation}>Back</button>
            </div>
          ) : null}
        </div>

        {/* Card window (centered 50vw, but will slide when explanation opens) */}
        <div className={`card-window ${explanationVisible ? "moved" : ""}`}>
          <div className="card-inner">
            {loading ? (
              <div className="placeholder">Loading...</div>
            ) : error ? (
              <div className="placeholder error">Error: {error}</div>
            ) : currentCard ? (
              <>
                <div className="question-block">
                  <h2 className="question-text">{currentCard.question}</h2>
                </div>

                <div className="choices-block">
                  {Array.isArray(currentCard.choices) ? (
                    currentCard.choices.map((c, i) => (
                      <button
                        key={i}
                        className={`choice-btn ${selectedChoice === i ? "selected" : ""}`}
                        onClick={() => handleChoice(i)}
                        disabled={selectedChoice !== null}
                      >
                        {c}
                      </button>
                    ))
                  ) : (
                    <div>No choices available</div>
                  )}
                </div>

                {feedback && (
                  <div className={`feedback ${feedback.ok ? "ok" : "bad"}`}>
                    <div>{feedback.text}</div>
                    <div className="small-expl">{feedback.explanation ? feedback.explanation : ""}</div>
                  </div>
                )}

                <div className="controls">
                  <button className="btn nav-btn" onClick={handlePrev}>Previous</button>
                  <button className="btn nav-btn" onClick={handleNext}>Next</button>
                  <button className="btn nav-btn" onClick={openExplanation}>Full explanation</button>
                  <button className={`btn mark-btn ${isMarked ? "marked" : ""}`} onClick={handleToggleMark}>
                    {isMarked ? "Marked ★" : "Mark this card ☆"}
                  </button>
                </div>
              </>
            ) : (
              <div className="placeholder">No cards in this topic.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
