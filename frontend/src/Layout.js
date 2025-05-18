import React from "react";

export default function Layout({ children, onLogout }) {
  return (
    <div>
      {/* La nav est maintenant stylée via App.css */}
      <nav>
        <div className="nav-logo">
          {/* Assure-toi que l'image est dans frontend/public/data/logo-fr.png */}
          <img src="/data/logo-fr.png" alt="Logo FR" />
        </div>
        <button onClick={onLogout}>Déconnexion</button>
      </nav>
      <div style={{ marginTop: "20px" }}>{children}</div>
    </div>
  );
}
