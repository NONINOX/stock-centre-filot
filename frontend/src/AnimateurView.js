import React, { useEffect, useState } from "react";

// Utilise la variable d'environnement fournie par Render, ou localhost pour le développement local
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";
export default function AnimateurView() {
  const [stockData, setStockData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
     fetch(`${API_BASE_URL}/api/stock`)
      .then((res) => res.json())
      .then((data) => setStockData(data))
      .catch((err) =>
        console.error("Erreur lors du chargement des données :", err)
      );
  }, []);

  // Demander du matériel par email
  const handleRequestMaterial = (articleName, currentQuantity) => {
    const subject = encodeURIComponent(`Demande de matériel : ${articleName}`);
    const body = encodeURIComponent(
      `Bonjour,\n\nJe souhaiterais faire une demande pour l'article suivant :\n\nArticle : ${articleName}\nQuantité actuelle en stock : ${currentQuantity}\n\nMerci de préciser la quantité à commander.\n\nCordialement.`
    );
    window.location.href = `mailto:nono.benhammou@gmail.com?subject=${subject}&body=${body}`;
    alert("Votre client de messagerie va s'ouvrir pour envoyer la demande.\nVeuillez vérifier et envoyer l'email.");
  };

  // Demander du nouveau matériel (non listé) par email
  const handleRequestNewMaterial = () => {
    const subject = encodeURIComponent("COMMANDE MATOS FILOT : Demande de nouveau matériel");
    const body = encodeURIComponent(
      "Bonjour,\n\nJe souhaiterais commander le nouveau matériel suivant :\n\nNom de l'article : [À COMPLÉTER PAR L'UTILISATEUR]\nQuantité souhaitée : [À COMPLÉTER PAR L'UTILISATEUR]\nDescription (optionnel) : [À COMPLÉTER PAR L'UTILISATEUR]\n\nCordialement."
    );
    window.location.href = `mailto:nono.benhammou@gmail.com?subject=${subject}&body=${body}`;
    alert("Votre client de messagerie va s'ouvrir pour envoyer la demande.\nVeuillez compléter les détails de l'article et envoyer l'email.");
  };

  const filteredData = stockData.filter((row) =>
    [row[0], row[1], row[3]].some((cell) =>
      cell?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="view-container">
      <h3>Bonjour animateur !</h3>
      <h2>Bienvenue sur la page de l'animateur</h2>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px'  }}>
        <input
          type="text"
          placeholder="Rechercher un article, boîte ou description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: '10px', padding: '8px', width: '300px', fontSize: 'inherit' }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px'  }}>
        <button onClick={handleRequestNewMaterial} className="request-new-btn">
          Demander nouveau matériel
        </button>
      </div>

      {filteredData.length === 0 && stockData.length > 0 ? (
        <p>Aucun article ne correspond à votre recherche.</p>
      ) : stockData.length === 0 ? (
        <p>Chargement des articles...</p>
      ) : (
        <div style={{ overflowX: 'auto', width: '100%' }}> {/* Ajout de ce div conteneur */}
          <table style={{ minWidth: '500px' /* Optionnel: pour forcer une largeur minimale */ }}>
            <thead>
              <tr>
                <th>Article</th>
                <th>Boîte</th>
                <th>Quantité</th>
                <th>Description</th>
                <th>Demande</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => {
                // Pour AnimateurView, l'index du map est suffisant si on n'a pas de suppression/édition qui modifie l'ordre.
                // Sinon, il faudrait aussi utiliser stockData.indexOf(row) si des opérations modifient stockData.
                // Ici, on prend les données directement de 'row'.
                const articleName = row[0];
                const currentQuantity = row[2];
                return (
                  <tr key={index}>
                    {row.map((cell, i) => (
                      <td key={i}>{cell}</td>
                    ))}
                    <td>
                      <button onClick={() => handleRequestMaterial(articleName, currentQuantity)} className="request-btn">Demander</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
