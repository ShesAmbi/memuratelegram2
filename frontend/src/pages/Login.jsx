import React, { useEffect } from "react";

export default function Login() {
  useEffect(() => {
    const container = document.getElementById("telegram-login");
    container.innerHTML = ""; // clear
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?15";
    script.async = true;
    script.setAttribute("data-telegram-login", "MemuraLogin_bot"); // without @
    script.setAttribute("data-size", "large");
    // IMPORTANT: data-auth-url must point to your backend auth endpoint
    const API_BASE = process.env.REACT_APP_API_URL || "";
    script.setAttribute("data-auth-url","https://memuratelegram2.onrender.com/api/auth/telegram/");
    script.setAttribute("data-request-access", "write");
    container.appendChild(script);
  }, []);

  return (
    <div style={{padding:20}}>
      <h2>Login with Telegram</h2>
      <div id="telegram-login" />
      <p>
        The Telegram Login widget is a Private and Secure way to authorize users on a website. If still have questions touch telegram logo
        <a href="https://core.telegram.org/bots/features#web-login" target="_blank" rel="noopener noreferrer">
          <img 
             src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" 
             alt="Telegram" 
             style={{ width: "20px", height: "20px", marginLeft: "5px", verticalAlign: "middle" }}
          />
        </a>
      </p>
    </div>
  );
}
