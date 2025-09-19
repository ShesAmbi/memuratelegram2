import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      // remove token from URL before navigating
      window.history.replaceState({}, document.title, "/callback");
      navigate("/books"); // send user to books after saving token
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <div>Logging you in...</div>;
}
