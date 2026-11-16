import React, { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Accountcreate from "./components/Accountcreate";
import Dashboard from "./components/Dashboard";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (data) => {
    // Handles both { _id, name, accountvalue } and { user: { _id, name, accountvalue } }
    const loggedInUser = data.user || data;
    console.log("Logged in user:", loggedInUser);
    setUser(loggedInUser);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          path="/login"
          element={
            !user ? (
              <Login type="Login" onLogin={handleLogin} />
            ) : user.accountvalue === 1 ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/accountcreate" replace />
            )
          }
        />

        <Route path="/signup" element={<Signup />} />

        <Route
          path="/accountcreate"
          element={
            user ? (
              <Accountcreate user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} onLogout={() => setUser(null)} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;