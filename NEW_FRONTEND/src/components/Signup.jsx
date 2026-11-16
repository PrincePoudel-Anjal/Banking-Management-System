import React, { useState } from "react";
import { UserRound, LockKeyhole, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Brand from "./Brand";
import "./Signup.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          password: password,
          name: username.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to register. Please try another email.");
      }

      navigate("/login");
    } catch (err) {
      console.error("Error submitting form", err);
      setError(err.message || "Something went wrong during sign up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="signup-page">
      <div className="signup-layout">
        {/* Left Hero Section */}
        <section className="signup-hero">
          <div>
            <Brand size="large" />
          </div>

          <div className="signup-hero-content">
            <p className="signup-hero-tag">Banking, made clear</p>
            <h1 className="signup-hero-title">
              Your money.
              <br />
              <span className="signup-hero-title-accent">In your hands.</span>
            </h1>
            <p className="signup-hero-description">
              A simple place to see your balance, send money, and stay close to every transaction.
            </p>
          </div>

          <div>
            <p className="signup-hero-footer-tag">PRIVATE. SIMPLE. YOURS.</p>
          </div>
        </section>

        {/* Right Form Card */}
        <section className="signup-card-container">
          <div className="signup-card">
            {/* Mobile Brand */}
            <div className="signup-mobile-brand">
              <Brand />
            </div>

            {/* Header */}
            <div className="signup-card-header">
              <p className="signup-badge">Get started</p>
              <h2 className="signup-card-title">Create an account</h2>
              <p className="signup-card-subtitle">Open your digital banking account in seconds.</p>
            </div>

            <form className="signup-form" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="signup-form-group">
                <label className="signup-form-label">Full name</label>
                <div className="signup-input-container">
                  <UserRound size={19} className="signup-input-icon" aria-hidden="true" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="signup-form-input"
                    placeholder="e.g. Alex Morgan"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="signup-form-group">
                <label className="signup-form-label">Email address</label>
                <div className="signup-input-container">
                  <Mail size={19} className="signup-input-icon" aria-hidden="true" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="signup-form-input"
                    placeholder="alex@northbank.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="signup-form-group">
                <label className="signup-form-label">Password</label>
                <div className="signup-input-container">
                  <LockKeyhole size={19} className="signup-input-icon" aria-hidden="true" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="signup-form-input"
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

              {/* Error banner */}
              {error && <div className="signup-error-banner">{error}</div>}

              {/* Submit Button */}
              <button type="submit" disabled={loading} className="signup-submit-btn">
                {loading ? (
                  <span>Creating account...</span>
                ) : (
                  <>
                    <span>Create account</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>

            {/* Link back to login */}
            <div className="signup-switch-container">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="signup-switch-btn"
              >
                Already have an account? <span className="signup-switch-accent">Sign in</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Signup;
