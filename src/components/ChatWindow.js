import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

// Connect to backend
//const socket = io("http://localhost:3000");
const socket = io("https://chat-backend-e2y1.onrender.com");

export default function ChatWindow({ username }) {
  const [currentRoom, setCurrentRoom] = useState("room1");
  const [rooms] = useState(["room1"]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Setup socket events
  useEffect(() => {
    if (!username) return;

    socket.emit("set username", { username, room: currentRoom });

    socket.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("user joined", (msg) => {
      setMessages((prev) => [
        ...prev,
        { systemMessage: msg.systemMessage, username: msg.username, time: msg.time },
      ]);
    });

    socket.on("user left", (msg) => {
      setMessages((prev) => [
        ...prev,
        { systemMessage: msg.systemMessage, username: msg.username, time: msg.time },
      ]);
    });

    return () => {
      socket.off("chat message");
      socket.off("user joined");
      socket.off("user left");
    };
  }, [username, currentRoom]);

  // Handle sending messages
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chat message", { username, room: currentRoom, message });
      setMessage("");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "Arial" }}>
      {/* ✅ Fixed Banner */}
      <div
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          backgroundColor: "#4CAF50",
          color: "white",
          padding: "15px",
          fontSize: "24px",
          fontWeight: "bold",
          textAlign: "center",
          zIndex: 1000,
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        }}
      >
        PalZone
      </div>

      {/* ✅ Main Layout */}
      <div style={{ display: "flex", flex: 1, marginTop: "70px" }}>
        {/* Left Room Panel */}
        <div style={{ width: "200px", borderRight: "1px solid #ccc", padding: "1rem" }}>
          <h3>Rooms</h3>
          {rooms.map((room) => (
            <div
              key={room}
              onClick={() => setCurrentRoom(room)}
              style={{
                padding: "0.5rem",
                cursor: "pointer",
                backgroundColor: currentRoom === room ? "#ddd" : "transparent",
              }}
            >
              {room}
            </div>
          ))}
        </div>

        {/* ✅ Chat Body */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "1rem" }}>
          <h2>Room: {currentRoom}</h2>

          <div
            style={{
              flex: 1,
              border: "1px solid #ccc",
              padding: "1rem",
              overflowY: "auto",
              marginBottom: "1rem",
              backgroundColor: "#f9f9f9",
              borderRadius: "10px",
            }}
          >
            {messages.map((msg, index) => {
              // System messages
              if (msg.systemMessage) {
                return (
                  <div key={index} style={{ textAlign: "center", marginBottom: "8px" }}>
                    <em style={{ color: "#888" }}>
                      [{msg.time}] {msg.username} {msg.systemMessage}
                    </em>
                  </div>
                );
              }

              // User messages
              const isCurrentUser = msg.username === username;
              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: isCurrentUser ? "flex-end" : "flex-start",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: isCurrentUser ? "#4CAF50" : "#E0E0E0",
                      color: isCurrentUser ? "white" : "black",
                      padding: "10px 15px",
                      borderRadius: "20px",
                      maxWidth: "60%",
                      wordBreak: "break-word",
                      textAlign: "left",
                    }}
                  >
                    {!isCurrentUser && (
                      <div
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                          marginBottom: "3px",
                        }}
                      >
                        {msg.username}
                      </div>
                    )}
                    {msg.message}
                    <div
                      style={{
                        fontSize: "0.7rem",
                        marginTop: "3px",
                        textAlign: "right",
                        opacity: 0.7,
                      }}
                    >
                      {msg.time}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} style={{ display: "flex" }}>
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                flex: 1,
                padding: "0.75rem",
                borderRadius: "25px",
                border: "1px solid #ccc",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "25px",
                border: "none",
                backgroundColor: "#4CAF50",
                color: "white",
                fontWeight: "bold",
                marginLeft: "0.5rem",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
