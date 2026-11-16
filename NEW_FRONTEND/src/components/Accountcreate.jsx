import React, { useState } from "react";
import {useNavigate} from "react-router-dom"

export default function AccountCreate({ user }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user?._id || !user?.name) {
      setError("User details are missing. Please log in first.");
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
          name: user.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create account");
      }

      console.log("Account created:", data);
      navigate('/dashboard');
    } catch (err) {
      console.error("Error creating account:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create Account</h2>
      <p>Account Holder: {user?.name || "User"}</p>

      <form onSubmit={handleSubmit}>
        {error && <p>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}