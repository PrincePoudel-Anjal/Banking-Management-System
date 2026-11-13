import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import {
  authAPI,
  accountAPI,
  transactionAPI,
  DEFAULT_USER,
  DEFAULT_TRANSACTIONS,
  generateIdempotencyKey
} from "./services/api";

const STORAGE_KEYS = {
  USER: "northbank_user",
  BALANCE: "northbank_balance",
  TRANSACTIONS: "northbank_transactions"
};

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem("northbank_logged_in"));
  });

  const [balance, setBalance] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BALANCE);
      return saved !== null ? Number(saved) : 12840.50;
    } catch {
      return 12840.50;
    }
  });

  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : DEFAULT_TRANSACTIONS;
    } catch {
      return DEFAULT_TRANSACTIONS;
    }
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.BALANCE, balance.toString());
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (err) {
      console.warn("Storage sync failed:", err);
    }
  }, [user, balance, transactions]);

  const handleLogin = async (email, password) => {
    const res = await authAPI.login(email, password);
    const loggedUser = {
      ...DEFAULT_USER,
      ...res.user,
      email: res.user?.email || email,
      name: res.user?.name || email.split("@")[0]
    };
    setUser(loggedUser);
    setIsLoggedIn(true);
    localStorage.setItem("northbank_logged_in", "true");
  };

  const handleRegister = async (name, email, password) => {
    const res = await authAPI.register(name, email, password);
    const registeredUser = {
      ...DEFAULT_USER,
      ...res.user,
      name,
      email
    };
    setUser(registeredUser);
    setIsLoggedIn(true);
    localStorage.setItem("northbank_logged_in", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("northbank_logged_in");
  };

  const handleTransfer = async ({ recipient, recipientAccount, amount, description }) => {
    const key = generateIdempotencyKey("tf");
    
    // Call backend API (handles fallback if offline)
    await transactionAPI.transfer(
      user?._id || DEFAULT_USER._id,
      recipientAccount,
      amount,
      key
    );

    // Update local reactive state
    setBalance((prev) => Number((prev - amount).toFixed(2)));
    const newTx = {
      id: Date.now(),
      name: recipient,
      detail: `Account •• ${recipientAccount.slice(-4) || recipientAccount}`,
      date: "Just now",
      amount: -amount,
      type: "outgoing",
      status: "completed"
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleDeposit = async ({ amount, description }) => {
    const key = generateIdempotencyKey("dp");

    // Call backend API (handles fallback if offline)
    await transactionAPI.deposit(
      user?._id || DEFAULT_USER._id,
      amount,
      description,
      key
    );

    // Update local reactive state
    setBalance((prev) => Number((prev + amount).toFixed(2)));
    const newTx = {
      id: Date.now(),
      name: description || "Cash Deposit",
      detail: `Account •• ${user?.account?.accountNumber || "4832"}`,
      date: "Just now",
      amount: amount,
      type: "incoming",
      status: "completed"
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleCreateAccount = async (accountName) => {
    await accountAPI.createAccount(user?._id || DEFAULT_USER._id, accountName);
    setUser((prev) => ({
      ...prev,
      account: {
        ...prev.account,
        name: accountName
      }
    }));
  };

  return isLoggedIn ? (
    <Dashboard
      user={user}
      balance={balance}
      transactions={transactions}
      onLogout={handleLogout}
      onTransfer={handleTransfer}
      onDeposit={handleDeposit}
      onCreateAccount={handleCreateAccount}
    />
  ) : (
    <Login onLogin={handleLogin} onRegister={handleRegister} />
  );
}

