// src/components/UsernamePrompt.js
import React, { useState } from "react";

function UsernamePrompt({ onSetUsername }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onSetUsername(name);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter your name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ padding: "0.5rem", width: "70%" }}
      />
      <button type="submit" style={{ padding: "0.5rem 1rem", marginLeft: "0.5rem" }}>
        Join
      </button>
    </form>
  );
}

export default UsernamePrompt;
