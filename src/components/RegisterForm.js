import React, { useState } from "react";
import axios from "axios";

export default function RegisterForm({ onRegistered }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    try {
      //await axios.post("http://localhost:3000/api/auth/register", formData);
      await axios.post("https://chat-backend-e2y1.onrender.com/api/auth/register", formData);
      setSuccessMsg("Successfully registered! Please proceed to Login.");
      setErrorMsg("");
      setIsRegistered(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Registration failed");
      setSuccessMsg("");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial",
      }}
    >
      {/* ✅ Fixed Banner */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#4CAF50",
          padding: "20px 0",
          textAlign: "center",
          color: "white",
          fontSize: "28px",
          fontWeight: "bold",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          zIndex: 1000,
        }}
      >
        PalZone
      </div>

      {/* ✅ Card container with spacing below fixed banner */}
      <div
        style={{
          marginTop: "120px", // Pushes form below banner
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          width: "400px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Register</h2>

        {/* Success message with Login link */}
        {successMsg && (
          <div style={{ marginBottom: "10px", color: "green" }}>
            {successMsg}{" "}
            <span
              style={{
                color: "blue",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={onRegistered}
            >
              Login
            </span>
          </div>
        )}

        {errorMsg && (
          <div style={{ color: "red", marginBottom: "10px" }}>{errorMsg}</div>
        )}

        {/* ✅ Show form only if not registered */}
        {!isRegistered && (
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ✅ Styles
const inputStyle = {
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "16px",
};

const buttonStyle = {
  padding: "12px",
  borderRadius: "5px",
  border: "none",
  backgroundColor: "#4CAF50",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
};
