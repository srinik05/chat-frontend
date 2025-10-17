import React, { useState } from "react";
import axios from "axios";

export default function LoginForm({ onLoginSuccess }) {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        //const res = await axios.post("http://localhost:3000/api/auth/login", {
        const res = io("https://chat-backend-e2y1.onrender.com/api/auth/login", {
        loginId,
        password,
      });
      setMessage(res.data.message);
      onLoginSuccess(res.data.user); // pass user data
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div>
      {/* 🔹 Fixed Banner at Top */}
      <div
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          backgroundColor: "#4CAF50",
          color: "white",
          textAlign: "center",
          padding: "1rem",
          fontSize: "1.5rem",
          fontWeight: "bold",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}
      >
        PalZone
      </div>

      {/* 🔹 Login Form Container */}
      <div
        style={{
          marginTop: "8rem",
          maxWidth: "400px",
          marginLeft: "auto",
          marginRight: "auto",
          padding: "2rem",
          border: "1px solid #ddd",
          borderRadius: "10px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "1rem", color: "#333" }}>Login</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              placeholder="Username / Email / Phone"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "107%",
              cursor: "pointer",
              padding: "12px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#4CAF50",
              color: "white",
              fontSize: "18px",
            }}
          >
            Login
          </button>
          
        </form>

        {message && (
          <p style={{ marginTop: "1rem", color: message.includes("failed") ? "red" : "green" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
