import React, { useState } from "react";

function MessageInput({ onSendMessage }) {
  const [msg, setMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendMessage(msg);
    setMsg("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", padding: "0.5rem" }}>
      <input
        type="text"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Type a message..."
        style={{ flex: 1, padding: "0.5rem" }}
      />
      <button type="submit" style={{ marginLeft: "0.5rem" }}>Send</button>
    </form>
  );
}

export default MessageInput;
