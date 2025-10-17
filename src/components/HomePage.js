import React from "react";

export default function Home({ onSelect }) {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome to PalZone 💬</h1>
      <p>Select an option to continue:</p>
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => onSelect("login")}
          style={{ padding: "0.5rem 1rem", marginRight: "10px" }}
        >
          Login
        </button>
        <button
          onClick={() => onSelect("register")}
          style={{ padding: "0.5rem 1rem" }}
        >
          Register
        </button>
      </div>
    </div>
  );
}
