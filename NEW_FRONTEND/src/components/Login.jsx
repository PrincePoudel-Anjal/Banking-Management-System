import React, { useState } from "react";
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");    
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });
      if (!response.ok) {
        throw new Error(`Login Failed! Response Status: ${response.status}`);
      }
      const result = await response.json();
      onLogin(result);
    } catch (err) {
      setError(err.message);
    }
  };
  
  return (
    <div className="login-container" style={{ padding: "20px" }}>
      <h2>Bank Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <input
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div style={{ marginTop: "10px" }}>
          <button type="submit">Login</button>
        </div>
        <button onSignup = {onSignup}>SUBMIT</button>
      </form>
    </div>
  );
}
export default Login;