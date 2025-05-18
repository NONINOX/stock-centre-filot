import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AdminView from "./AdminView";
import AnimateurView from "./AnimateurView"; // si tu as ce composant
import Login from "./Login";
import Layout from "./Layout";
import "./App.css"; // <-- Import du CSS global ici


export default function App() {
  const [user, setUser] = useState(null); // null = pas connecté

  const handleLogin = (username) => {
    setUser(username);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout onLogout={handleLogout}>
      <Routes>
        {(user === "admin" || user === "nono" || user === "tibou") && (
          <>
            <Route
              path="/"
              // Si "nono" ou "tibou" se connectent, `user` vaudra "nono" ou "tibou".
              // AdminView sera rendue car la condition est maintenant remplie.
              element={<AdminView user={user} />}
            />
          </>
        )}
        {user === "animateur" && (
          <Route path="/" element={<AnimateurView />} />
        )}
      </Routes>
    </Layout>
  );
}
