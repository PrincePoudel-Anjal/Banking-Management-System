import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

// Sample mock data for standalone frontend
const DEFAULT_USER = {
  _id: "usr-928371",
  name: "Alex Morgan",
  email: "alex@northbank.com",
  account: {
    _id: "acc-109283",
    name: "Alex Everyday Checking",
    accountNumber: "4832",
    routingNumber: "021000021",
    currency: "USD",
    status: "ACTIVE",
    balance: 12840.5
  }
};

const DEFAULT_TRANSACTIONS = [
  {
    id: 1,
    name: "Salary deposit",
    detail: "Acme Studio",
    date: "Today, 9:42 AM",
    amount: 4200,
    type: "incoming",
    status: "completed"
  },
  {
    id: 2,
    name: "Maya Thompson",
    detail: "Account •• 7402",
    date: "Yesterday, 4:18 PM",
    amount: -680,
    type: "outgoing",
    status: "completed"
  },
  {
    id: 3,
    name: "Northline Utilities",
    detail: "Monthly bill",
    date: "Mar 18, 11:06 AM",
    amount: -142.8,
    type: "outgoing",
    status: "completed"
  },
  {
    id: 4,
    name: "Jordan Lee",
    detail: "Account •• 2198",
    date: "Mar 16, 2:32 PM",
    amount: 350,
    type: "incoming",
    status: "completed"
  }
];

const STORAGE_KEYS = {
  USER: "bank_user",
  BALANCE: "bank_balance",
  TRANSACTIONS: "bank_transactions",
  LOGGED_IN: "bank_logged_in"
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
    return Boolean(localStorage.getItem(STORAGE_KEYS.LOGGED_IN));
  });

  const [balance, setBalance] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BALANCE);
      return saved !== null ? Number(saved) : 12840.5;
    } catch {
      return 12840.5;
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

  // Sync to local state storage so user interactions persist cleanly
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.BALANCE, balance.toString());
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
      if (isLoggedIn) {
        localStorage.setItem(STORAGE_KEYS.LOGGED_IN, "true");
      } else {
        localStorage.removeItem(STORAGE_KEYS.LOGGED_IN);
      }
    } catch (err) {
      console.warn("Storage sync failed:", err);
    }
  }, [user, balance, transactions, isLoggedIn]);

  // Frontend login handler (no backend dependency)
  const handleLogin = async (email, password) => {
    // Simulated UI validation & state transition
    await new Promise((r) => setTimeout(r, 400));
    const cleanName = email.split("@")[0].replace(/[._]/g, " ");
    const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

    setUser((prev) => ({
      ...prev,
      name: formattedName || "Alex Morgan",
      email: email
    }));
    setIsLoggedIn(true);
  };

  // Frontend register handler (no backend dependency)
  const handleRegister = async (name, email, password) => {
    await new Promise((r) => setTimeout(r, 400));
    setUser({
      _id: `usr-${Date.now()}`,
      name,
      email,
      account: {
        _id: `acc-${Date.now()}`,
        name: `${name}'s Account`,
        accountNumber: String(Math.floor(1000 + Math.random() * 9000)),
        routingNumber: "021000021",
        currency: "USD",
        status: "ACTIVE",
        balance: 1000.0
      }
    });
    setBalance(1000.0);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Frontend transfer handler
  const handleTransfer = async ({ recipient, recipientAccount, amount, description }) => {
    await new Promise((r) => setTimeout(r, 350));
    setBalance((prev) => Math.max(0, prev - amount));

    const newTx = {
      id: Date.now(),
      name: recipient,
      detail: `Account •• ${recipientAccount.slice(-4) || "0000"}`,
      date: "Just now",
      amount: -Math.abs(amount),
      type: "outgoing",
      status: "completed"
    };

    setTransactions((prev) => [newTx, ...prev]);
  };

  // Frontend deposit handler
  const handleDeposit = async ({ amount, description }) => {
    await new Promise((r) => setTimeout(r, 350));
    setBalance((prev) => prev + amount);

    const newTx = {
      id: Date.now(),
      name: "Cash Deposit",
      detail: description || "Account Deposit",
      date: "Just now",
      amount: Math.abs(amount),
      type: "incoming",
      status: "completed"
    };

    setTransactions((prev) => [newTx, ...prev]);
  };

  // Frontend create account handler
  const handleCreateAccount = async ({ name }) => {
    await new Promise((r) => setTimeout(r, 300));
    setUser((prev) => ({
      ...prev,
      account: {
        ...prev.account,
        name: name || "Secondary Savings",
        accountNumber: String(Math.floor(1000 + Math.random() * 9000))
      }
    }));
  };

  if (!isLoggedIn) {
    return (
      <Login
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    );
  }

  return (
    <Dashboard
      user={user}
      balance={balance}
      transactions={transactions}
      onLogout={handleLogout}
      onTransfer={handleTransfer}
      onDeposit={handleDeposit}
      onCreateAccount={handleCreateAccount}
    />
  );
}
