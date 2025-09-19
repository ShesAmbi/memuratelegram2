import logo from './logo.svg';
import './App.css';
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CardsPage from "./components/CardsPage";
import BooksPage from "./pages/BooksPage";
import BooksDetail from "./pages/BooksDetail";
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import CallbackPage from './components/CallbackPage';  // adjust path if needed


function App() {
  // 👇 Your actual logic: you’ll probably fetch these after login
  const topicId = 2;
  // Check if user is logged in by looking for JWT token in localStorage
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

   return (
    <BrowserRouter>
      <Routes>

        {/* If logged in, redirect root to /books; otherwise go to Login page */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/books" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/cards" element={<ProtectedRoute><CardsPage topicId={topicId}/></ProtectedRoute> }/>
        <Route path="/books" element={<ProtectedRoute><BooksPage/></ProtectedRoute>} />
        <Route path="/books/:id" element={<BooksDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<CallbackPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

