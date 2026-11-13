// Banking API Client with automatic fallback to mock storage when backend is offline

const BASE_URL = "/api";

// Helper to generate unique idempotency keys
export function generateIdempotencyKey(prefix = "tx") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Initial mock transactions matching the UI design
export const DEFAULT_TRANSACTIONS = [
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

export const DEFAULT_USER = {
  _id: "6724ba1f80164e24ef5471a1",
  name: "Alex Morgan",
  email: "alex@northbank.com",
  account: {
    _id: "6724ba1f80164e24ef5471a1",
    name: "Alex Everyday Account",
    accountNumber: "4832",
    routingNumber: "021000021",
    currency: "USD",
    status: "ACTIVE",
    balance: 12840.50
  }
};

// Check if backend is available
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${BASE_URL}-docs.json`, { method: "GET" });
    return res.ok;
  } catch (err) {
    return false;
  }
}

// Authentication API
export const authAPI = {
  async login(email, password) {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",  // Send/receive JWT HttpOnly cookie
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to log in");
      }
      return data;
    } catch (err) {
      // If network error, allow local demo sign in
      if (err.message === "Failed to fetch" || err.name === "TypeError") {
        console.warn("Backend unavailable, using demo mode");
        return {
          user: {
            _id: "demo-user-1",
            name: email.split("@")[0].replace(".", " "),
            email: email
          },
          message: "Logged in (Demo Mode)"
        };
      }
      throw err;
    }
  },

  async register(name, email, password) {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",  // Send/receive JWT HttpOnly cookie
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }
      return data;
    } catch (err) {
      if (err.message === "Failed to fetch" || err.name === "TypeError") {
        console.warn("Backend unavailable, registering in demo mode");
        return {
          user: {
            _id: `demo-${Date.now()}`,
            name,
            email
          },
          message: "Registered (Demo Mode)"
        };
      }
      throw err;
    }
  }
};

// Accounts API
export const accountAPI = {
  async createAccount(userId, name) {
    try {
      const res = await fetch(`${BASE_URL}/account/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",  // Send/receive JWT HttpOnly cookie
        body: JSON.stringify({ user: userId, name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Account creation failed");
      return data;
    } catch (err) {
      if (err.message === "Failed to fetch" || err.name === "TypeError") {
        return { message: "Account created (Demo Mode)" };
      }
      throw err;
    }
  }
};

// Transactions API
export const transactionAPI = {
  async transfer(fromAccount, toAccount, amount, idempotencyKey) {
    try {
      const res = await fetch(`${BASE_URL}/transactions/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromAccount,
          toAccount,
          amount: Number(amount),
          IdempotencyKey: idempotencyKey || generateIdempotencyKey("tf")
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Transfer failed");
      return data;
    } catch (err) {
      if (err.message === "Failed to fetch" || err.name === "TypeError") {
        return { message: "Transfer Successful (Demo Mode)" };
      }
      throw err;
    }
  },

  async deposit(userAccountId, amount, description, idempotencyKey) {
    try {
      const res = await fetch(`${BASE_URL}/transactions/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: userAccountId,
          moneyadd: Number(amount),
          Description: description || "Account Deposit",
          IdempotencyKey: idempotencyKey || generateIdempotencyKey("dp")
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Deposit failed");
      return data;
    } catch (err) {
      if (err.message === "Failed to fetch" || err.name === "TypeError") {
        return { message: "Transaction has been Completed (Demo Mode)" };
      }
      throw err;
    }
  }
};

