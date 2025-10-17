import React from "react";

function TopBar() {
  return (
    <div style={{
      backgroundColor: "#4a90e2",
      color: "white",
      padding: "1rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <h2>PalZone</h2>
      <div>
        <button style={{ marginRight: "1rem" }}>Login</button>
        <button>Register</button>
      </div>
    </div>
  );
}

export default TopBar;
