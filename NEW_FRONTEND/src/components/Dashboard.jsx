import React, { useState, useEffect } from "react";


function Dashboard({ user, onLogout }) {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // 2. Put the fetch call inside useEffect
  useEffect(() => {
    const fetchAccount = async () => {
      setError("");
      try {
        const response = await fetch("http://localhost:3000/api/account/checkaccount", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          
          body: JSON.stringify({
            userId: user?._id,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to load account");
        } else {
          // Matches { account } returned by your backend controller
          setAccount(data.account);
        }
      } catch (err) {
        console.error(err);
        setError("Network error while fetching account");
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [user]); // Re-runs if the user prop changes

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Hello {account?.name || user?.name || "User"}</h2>
      {account ? (
        <p>Current Balance: {account.balance.$numberDecimal}</p>
      ) : (
        <p>No bank account found for this user.</p>
      )}
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;