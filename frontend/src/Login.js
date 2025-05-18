import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation simple des identifiants
    if (
      (username === "admin" && password === "5020") || // Admin existant
      (username === "nono" && password === "8273") ||   // Nouvel admin : nono
      (username === "tibou" && password === "1300") ||  // Nouvel admin : tibou
      (username === "animateur" && password === "113")
    ) {
      onLogin(username);
    } else {
      setError("Identifiants incorrects");
    }
  };

  return (
    <div className="login-container"> {/* <-- C'est LA ligne importante ici ! */}
      <h2>Connexion</h2>
      {/* Ajout du logo ici */}
      <div className="login-logo">
        {/* Assure-toi que l'image est dans frontend/public/data/logo-fr.png */}
        <img src="/data/logo-fr.png" alt="Logo FR" />
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Utilisateur :</label>
          <input
            type="text"
            id="username" // Ajout d'un id pour le htmlFor
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required // Bonne pratique d'ajouter required si le champ l'est
          />
        </div>
        <div>
          <label htmlFor="password">Mot de passe :</label>
          <input
            type="password"
            id="password" // Ajout d'un id pour le htmlFor
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required // Bonne pratique
          />
        </div>
        <button type="submit">Se connecter</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
