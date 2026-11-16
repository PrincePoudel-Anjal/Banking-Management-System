import React, { useState } from "react";
import { UserRound, Landmark, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Brand from "./Brand";
import "./Accountcreate.css";

export default function AccountCreate({ user }) {
  const [accountName, setAccountName] = useState(
    user?.name ? `${user.name}'s Checking Account` : "Everyday Checking"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user?._id || !user?.name) {
      setError("User session not found. Please sign in first.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/account/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          user: user._id,
          name: accountName.trim() || `${user.name}'s Account`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create account");
      }

      console.log("Account created:", data);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error creating account:", err);
      setError(err.message || "An error occurred while creating your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="accountcreate-page">
      <div className="accountcreate-layout">
        {/* Left Hero Section */}
        <section className="accountcreate-hero">
          <div>
            <Brand size="large" />
          </div>

          <div className="accountcreate-hero-content">
            <p className="accountcreate-hero-tag">Banking, made clear</p>
            <h1 className="accountcreate-hero-title">
              Your money.
              <br />
              <span className="accountcreate-hero-title-accent">In your hands.</span>
            </h1>
            <p className="accountcreate-hero-description">
              A simple place to see your balance, send money, and stay close to every transaction.
            </p>
          </div>

          <div>
            <p className="accountcreate-hero-footer-tag">PRIVATE. SIMPLE. YOURS.</p>
          </div>
        </section>

        {/* Right Form Card */}
        <section className="accountcreate-card-container">
          <div className="accountcreate-card">
            {/* Mobile Brand */}
            <div className="accountcreate-mobile-brand">
              <Brand />
            </div>

            {/* Header */}
            <div className="accountcreate-card-header">
              <p className="accountcreate-badge">Step 2 of 2 • Account Setup</p>
              <h2 className="accountcreate-card-title">Open your bank account</h2>
              <p className="accountcreate-card-subtitle">
                Link your verified profile to start banking with Northbank.
              </p>
            </div>

            <form className="accountcreate-form" onSubmit={handleSubmit}>
              {/* Account Holder Name (Verified) */}
              <div className="accountcreate-form-group">
                <label className="accountcreate-form-label">Account holder</label>
                <div className="accountcreate-input-container readonly">
                  <UserRound size={19} className="accountcreate-input-icon" aria-hidden="true" />
                  <input
                    type="text"
                    value={user?.name || "User"}
                    disabled
                    className="accountcreate-form-input"
                  />
                  <ShieldCheck size={18} className="accountcreate-verified-icon" title="Verified user profile" />
                </div>
              </div>

              {/* Account Name */}
              <div className="accountcreate-form-group">
                <label className="accountcreate-form-label">Account title</label>
                <div className="accountcreate-input-container">
                  <Landmark size={19} className="accountcreate-input-icon" aria-hidden="true" />
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="accountcreate-form-input"
                    placeholder="Everyday Checking Account"
                    required
                  />
                </div>
              </div>

              {/* Error banner */}
              {error && <div className="accountcreate-error-banner">{error}</div>}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="accountcreate-submit-btn"
              >
                {loading ? (
                  <span>Opening account...</span>
                ) : (
                  <>
                    <span>Open account</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>

            {/* Benefit reassurance notes */}
            <p className="accountcreate-footer-note">
              Zero maintenance fees • Instant digital card access • 256-bit encryption
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
