import React, { useState } from "react";
import HomePage from "./components/HomePage";   // updated import
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import ChatWindow from "./components/ChatWindow";

function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("home"); // home / login / register

  // After registration, redirect to login
  const handleRegistered = () => setScreen("login");

  // After successful login, set the user
  const handleLoginSuccess = (userData) => setUser(userData);

  // Handle screen selection from HomePage buttons
  const handleSelect = (screenName) => setScreen(screenName);

  if (!user) {
    if (screen === "home") return <HomePage onSelect={handleSelect} />;
    if (screen === "login") return <LoginForm onLoginSuccess={handleLoginSuccess} />;
    if (screen === "register") return <RegisterForm onRegistered={handleRegistered} />;
  }

  // User is logged in → show ChatWindow
  return <ChatWindow username={user.username} />;
}

export default App;
