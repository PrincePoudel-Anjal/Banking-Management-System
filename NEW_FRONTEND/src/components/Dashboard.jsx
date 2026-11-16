import React, { useState, useEffect } from "react";
import {
  LogOut,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Send,
  User,
  DollarSign
} from "lucide-react";
import Brand from "./Brand";
import "./Dashboard.css";

function Dashboard({ user, onLogout }) {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Transfer state
  const [recipientUserId, setRecipientUserId] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferError, setTransferError] = useState("");
  const [transferSuccess, setTransferSuccess] = useState("");

  // const checkBalance = async ()=>{
  //   const [balance,setBalance] = useState('');
  
  //   const response = await fetch(



  //   );

  // }

  // Fetching account based on userId
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
        setError(data.message || "Failed to load account details.");
      } else {
        setAccount(data.account);
      }
    } catch (err) {
      console.error(err);
      setError("Network error while connecting to banking server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, [user]);

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    setTransferError("");
    setTransferSuccess("");
    setTransferLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/transactions/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          fromAccount: account._id,
          toAccount: recipientUserId.trim(),
          amount: parseFloat(transferAmount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setTransferError(data.message || "Failed to transfer.");
      } else {
        setTransferSuccess(data.message || "Transfer completed successfully.");
        setRecipientUserId("");
        setTransferAmount("");
        fetchAccount();
      }
    } catch (err) {
      console.error(err);
      setTransferError("Network error while connecting to banking server.");
    } finally {
      setTransferLoading(false);
    }
  };

  // Safe decimal & number balance formatter
  const formatBalance = (bal) => {
    if (!bal && bal !== 0) return "0.00";
    const val = typeof bal === "object" && bal.$numberDecimal ? bal.$numberDecimal : bal;
    const num = parseFloat(val);
    return isNaN(num)
      ? "0.00"
      : num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const userName = account?.name || user?.name || "Account Holder";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="dashboard-page">
      {/* 1. TOP NAVIGATION BAR */}
      <header className="dashboard-header">
        <div className="dashboard-header-inner">
          <Brand />

          <div className="dashboard-header-user">
            <div className="header-user-info">
              <span className="header-user-name">{userName}</span>
              <small className="header-account-tag">
                Account •• {account?._id ? account._id.slice(-4) : "----"}
              </small>
            </div>

            <div className="header-avatar">
              {initials}
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="header-logout-btn"
              title="Log out"
            >
              <LogOut size={15} />
              <span className="logout-text">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="dashboard-main">
        {/* Loading state */}
        {loading && (
          <div className="dashboard-loading">
            <RefreshCw className="spinner-icon" />
            <span>Loading your banking dashboard...</span>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="dashboard-error-box">
            <div className="error-content">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
            <button onClick={fetchAccount} className="retry-btn">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Header / Greeting */}
            <section className="greeting-section">
              <div>
                <p className="greeting-tag">Welcome back</p>
                <h1 className="greeting-title">शुभ दिन, {userName}</h1>
              </div>

              <div>
                <button
                  type="button"
                  onClick={fetchAccount}
                  className="refresh-btn"
                >
                  <RefreshCw size={14} />
                  <span>Refresh</span>
                </button>
              </div>
            </section>

            {/* Hero Balance Card */}
            <section className="balance-hero-card">
              <div className="balance-card-inner">
                <div>
                  <div className="balance-status-row">
                    <span className="balance-label">Available Balance</span>
                    <span className="status-pill">
                      <span className="status-dot"></span>
                      ACTIVE
                    </span>
                  </div>

                  <div className="balance-amount-display">
                    <span className="balance-currency-symbol">$</span>
                    <span className="balance-number">
                      {account ? formatBalance(account.balance) : "0.00"}
                    </span>
                    <span className="balance-currency-code">USD</span>
                  </div>
                </div>

                <div className="account-snapshot-pill">
                  <div className="snapshot-row">
                    <span>Account Number</span>
                    <span className="snapshot-val mono">
                      •••• {account?._id ? account._id.slice(-6) : "4832"}
                    </span>
                  </div>
                  <div className="snapshot-row">
                    <span>Routing Number</span>
                    <span className="snapshot-val mono">021000021</span>
                  </div>
                  <div className="snapshot-row">
                    <span>Account Type</span>
                    <span className="snapshot-val">Everyday Checking</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Dashboard Grid: Transfer Money & Account Info */}
            <div className="dashboard-grid">
              {/* Transfer Money Card */}
              <section className="transfer-card">
                <div className="transfer-card-header">
                  <div>
                    <h3 className="transfer-card-title">Transfer Money</h3>
                    <p className="transfer-card-subtitle">
                      Send funds directly to another user account.
                    </p>
                  </div>
                  <div className="transfer-icon-badge">
                    <Send size={18} />
                  </div>
                </div>

                <form onSubmit={handleTransferSubmit} className="transfer-form">
                  {transferError && (
                    <div className="feedback-error">
                      <AlertCircle size={18} />
                      <span>{transferError}</span>
                    </div>
                  )}

                  {transferSuccess && (
                    <div className="feedback-success">
                      <CheckCircle2 size={18} />
                      <span>{transferSuccess}</span>
                    </div>
                  )}

                  <div className="transfer-form-group">
                    <label htmlFor="recipientUserId" className="transfer-form-label">
                      Recipient User ID
                    </label>
                    <div className="transfer-input-container">
                      <User size={18} className="transfer-input-icon" />
                      <input
                        id="recipientUserId"
                        type="text"
                        className="transfer-form-input"
                        placeholder="Enter recipient user ID"
                        value={recipientUserId}
                        onChange={(e) => setRecipientUserId(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="transfer-form-group">
                    <label htmlFor="transferAmount" className="transfer-form-label">
                      Amount (USD)
                    </label>
                    <div className="transfer-input-container">
                      <DollarSign size={18} className="transfer-input-icon" />
                      <input
                        id="transferAmount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        className="transfer-form-input"
                        placeholder="0.00"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="transfer-submit-btn"
                    disabled={transferLoading}
                  >
                    <Send size={16} />
                    <span>{transferLoading ? "Processing..." : "Transfer Money"}</span>
                  </button>
                </form>
              </section>

              {/* Account Snapshot Card */}
              <aside className="overview-aside">
                <div className="overview-card">
                  <h3 className="overview-card-title">Account Overview</h3>
                  <p className="overview-card-subtitle">
                    Verified digital credentials and active protection.
                  </p>

                  <div className="overview-list">
                    <div className="overview-item">
                      <span className="overview-label">Account Holder</span>
                      <span className="overview-val">{userName}</span>
                    </div>

                    <div className="overview-item">
                      <span className="overview-label">Email Address</span>
                      <span className="overview-val">{user?.email || "alex@northbank.com"}</span>
                    </div>

                    <div className="overview-item">
                      <span className="overview-label">Account ID</span>
                      <span className="overview-val mono">
                        {account?._id || "Not assigned"}
                      </span>
                    </div>

                    <div className="overview-item">
                      <span className="overview-label">Currency</span>
                      <span className="overview-val">USD ($)</span>
                    </div>

                    <div className="overview-item">
                      <span className="overview-label">Security</span>
                      <span className="security-badge">
                        <ShieldCheck size={16} /> 256-bit Encrypted
                      </span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;