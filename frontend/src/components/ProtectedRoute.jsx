// ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { fetchMe } from "../lib/auth";

export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // If no token at all, redirect immediately
    if (!token) {
      setOk(false);
      setChecking(false);
      return;
    }

    // Otherwise, verify token via backend
    fetchMe(token)
      .then(() => setOk(true))
      .catch(() => {
        localStorage.removeItem("token");
        setOk(false);
      })
      .finally(() => setChecking(false));
  }, []);

  // While checking token
  if (checking) return <div>Checking authentication...</div>;

  // If invalid or missing token
  if (!ok) return <Navigate to="/cards" replace />;

  // If valid
  return children;
}