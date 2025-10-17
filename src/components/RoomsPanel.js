import React from "react";

function RoomsPanel({ currentRoom, setCurrentRoom }) {
  //const rooms = ["room1", "room2", "room3"];
  const rooms = ["room1"];
  return (
    <div style={{
      width: "150px",
      borderRight: "1px solid #ccc",
      padding: "1rem"
    }}>
      <h4>Rooms</h4>
      {rooms.map((room) => (
        <div
          key={room}
          onClick={() => setCurrentRoom(room)}
          style={{
            padding: "0.5rem",
            margin: "0.2rem 0",
            cursor: "pointer",
            backgroundColor: currentRoom === room ? "#ddd" : "transparent"
          }}
        >
          {room}
        </div>
      ))}
    </div>
  );
}

export default RoomsPanel;
