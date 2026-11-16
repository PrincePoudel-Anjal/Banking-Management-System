import React, { useState } from "react";
import { UserRound, LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Brand from "./Brand";
import "./Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("alex@northbank.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

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
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-layout">
        {/* Left Hero Section */}
        <section className="login-hero">
          <div>
            <Brand size="large" />
          </div>

          <div className="login-hero-content">
            <p className="hero-tag">Banking, made clear</p>
            <h1 className="hero-title">
              Your money.
              <br />
              <span className="hero-title-accent">In your hands.</span>
            </h1>
            <p className="hero-description">
              A simple place to see your balance, send money, and stay close to every transaction.
            </p>
          </div>

          <div>
            <p className="hero-footer-tag">PRIVATE. SIMPLE. YOURS.</p>
          </div>
        </section>

        {/* Right Form Card */}
        <section className="login-card-container">
          <div className="login-card">
            {/* Mobile Brand */}
            <div className="login-mobile-brand">
              <Brand />
            </div>

            {/* Header */}
            <div className="login-card-header">
              <p className="login-badge">Welcome back</p>
              <h2 className="login-card-title">Sign in to your account</h2>
              <p className="login-card-subtitle">Your finances are ready when you are.</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              {/* Email Address */}
              <div className="form-group">
                <label className="form-label">Email address</label>
                <div className="input-container">
                  <UserRound size={19} className="input-icon" aria-hidden="true" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="alex@northbank.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-container">
                  <LockKeyhole size={19} className="input-icon" aria-hidden="true" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              {/* Error banner */}
              {error && <div className="error-banner">{error}</div>}

              {/* Submit Button */}
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign in</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>

            {/* Helper Note matching screenshot */}
            <p className="login-demo-hint">
              Demo account is ready to use. Select &quot;Sign in&quot; to continue.
            </p>

            {/* Link to Signup */}
            <div className="login-switch-container">
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="login-switch-btn"
              >
                New to Northbank? <span className="login-switch-accent">Create an account</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
