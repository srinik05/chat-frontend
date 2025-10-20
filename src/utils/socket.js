import { io } from "socket.io-client";

// ⚠️ Change URL to your deployed backend
 export const socket = io("https://chat-backend-e2y1.onrender.com", {
 //export const socket = io("http://localhost:3000", {
   transports: ["websocket"],
 });
// export const socket = io("http://localhost:3000", {
//   transports: ["websocket"],
// });