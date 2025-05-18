import React, { useEffect, useState } from "react";

export default function AdminView({ user }) { // Accepter la prop 'user'
  const [stockData, setStockData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // État pour formulaire
  const [form, setForm] = useState({
    article: "",
    boite: "",
    quantite: "",
    description: "",
  });

  // Index de l'article en édition, ou null si ajout
  const [editIndex, setEditIndex] = useState(null);

  // Charger les données au montage
  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = () => {
     fetch(`${API_BASE_URL}/api/stock`)
      .then((res) => res.json())
      .then((data) => setStockData(data))
      .catch((err) =>
        console.error("Erreur lors du chargement des données :", err)
      );
  };

  // Supprimer un article
  const handleDelete = (index) => {
    fetch(`${API_BASE_URL}/api/stock/${index}`, { method: "DELETE" })
      .then((res) => {
        if (res.ok) {
          // Mise à jour locale
          setStockData((prev) => prev.filter((_, i) => i !== index));
          if (editIndex === index) resetForm();
        } else {
          console.error("Erreur lors de la suppression");
        }
      })
      .catch((err) => console.error("Erreur suppression:", err));
  };

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

  // Remplir le formulaire avec un article existant pour édition
  const handleEdit = (index) => {
    const item = stockData[index];
    setForm({
      article: item[0],
      boite: item[1],
      quantite: item[2],
      description: item[3],
    });
    setEditIndex(index);
  };

  // Réinitialiser formulaire + mode ajout
  const resetForm = () => {
    setForm({ article: "", boite: "", quantite: "", description: "" });
    setEditIndex(null);
  };

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Soumettre formulaire (ajout ou modification)
  const handleSubmit = (e) => {
    e.preventDefault();

    const article = form.article.trim();
    const boite = form.boite.trim();
    const description = form.description.trim();
    const quantiteNumber = Number(form.quantite);

    if (!article) {
      alert("L'article est obligatoire.");
      return;
    }
    if (isNaN(quantiteNumber) || quantiteNumber < 0) {
      alert("La quantité doit être un nombre positif ou zéro.");
      return;
    }

    const newItem = [article, boite, quantiteNumber, description];

    if (editIndex !== null) {
      // Modification
       fetch(`${API_BASE_URL}/api/stock/${editIndex}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      })
        .then((res) => {
          if (res.ok) {
            setStockData((prev) =>
              prev.map((item, i) => (i === editIndex ? newItem : item))
            );
            resetForm();
          } else {
            alert("Erreur lors de la modification");
          }
        })
        .catch(() => alert("Erreur lors de la modification"));
    } else {
      // Ajout
      fetch(`${API_BASE_URL}/api/stock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      })
        .then((res) => {
          if (res.ok) {
            setStockData((prev) => [...prev, newItem]);
            resetForm();
          } else {
            alert("Erreur lors de l'ajout");
          }
        })
        .catch(() => alert("Erreur lors de l'ajout"));
    }
  };

  // Filtrer les articles selon recherche
  const filteredData = stockData.filter((row) =>
    [row[0], row[1], row[3]].some((cell) =>
      cell?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="view-container">
      <h3>Bonjour {user} !</h3> {/* Afficher le message de bienvenue */}
      <h2>Bienvenue sur la page d'administration</h2>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', marginRight: '590px' }}>
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
        <table border={1} cellPadding={5} style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Article</th>
              <th>Boîte</th>
              <th>Quantité</th>
              <th>Description</th>
              <th>Actions</th>
              <th>Demande</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => {
              // Note: index ici est relatif à filteredData,
              // donc on récupère l'index réel dans stockData
              const realIndex = stockData.indexOf(row);
              const articleName = row[0];
              const currentQuantity = row[2];
              return (
                <tr key={realIndex}>
                  {row.map((cell, i) => (
                    <td key={i}>{cell}</td>
                  ))}
                  <td>
                    <button onClick={() => handleEdit(realIndex)} className="edit-btn">Edit</button>{" "}
                    <button onClick={() => handleDelete(realIndex)} className="delete-btn">
                      Supprimer
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleRequestMaterial(articleName, currentQuantity)} className="request-btn">
                      Demander
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <hr style={{ margin: "20px 0" }} />

      {/* Le formulaire d'ajout/modification est ici. On peut lui donner une classe form-container aussi */}
      <div className="form-container"> 
        <h3>{editIndex !== null ? "Modifier un article" : "Ajouter un article"}</h3>
        <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>
            Article:{" "}
            <input
              type="text"
              name="article"
              value={form.article}
              onChange={handleChange}
              required
              // style={{ width: 300 }} /* Géré par CSS global ou spécifique si besoin */
            />
          </label>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>
            Boîte:{" "}
            <input
              type="text"
              name="boite"
              value={form.boite}
              onChange={handleChange}
              // style={{ width: 300 }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>
            Quantité:{" "}
            <input
              type="number"
              name="quantite"
              value={form.quantite}
              onChange={handleChange}
              min={0}
              // style={{ width: 100 }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>
            Description:{" "}
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              // style={{ width: 300 }}
            />
          </label>
        </div>
        <button type="submit">{editIndex !== null ? "Modifier" : "Ajouter"}</button>{" "}
        {editIndex !== null && (
          <button type="button" onClick={resetForm}>
            Annuler
          </button>
        )}
      </form>
      </div>
    </div>
  );
}
