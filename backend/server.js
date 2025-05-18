const express = require("express");
const cors = require("cors");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Chemin vers le fichier Excel
const EXCEL_PATH = path.join(__dirname, "data", "stock.xlsx");

// Lire les données Excel (hors en-tête)
function readExcel() {
  if (!fs.existsSync(EXCEL_PATH)) return [];
  const workbook = XLSX.readFile(EXCEL_PATH);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  return data.slice(1); // enlever l'en-tête
}

// Écrire les données dans Excel (avec en-tête)
function writeExcel(data) {
  const header = [["Article", "Boite", "Quantité", "Description"]];
  const worksheet = XLSX.utils.aoa_to_sheet([...header, ...data]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Stock");
  XLSX.writeFile(workbook, EXCEL_PATH);
}

// Routes

// 🔄 Lire tous les articles
app.get("/api/stock", (req, res) => {
  try {
    const data = readExcel();
    res.json(data);
  } catch (err) {
    console.error("Erreur lecture:", err);
    res.status(500).json({ error: "Erreur lecture fichier Excel" });
  }
});

// ➕ Ajouter un article
app.post("/api/stock", (req, res) => {
  const newRow = req.body;
  if (!Array.isArray(newRow) || newRow.length < 4) {
    return res.status(400).json({ error: "Format invalide" });
  }
  try {
    const data = readExcel();
    data.push(newRow);
    writeExcel(data);
    res.json({ success: true });
  } catch (err) {
    console.error("Erreur ajout:", err);
    res.status(500).json({ error: "Erreur ajout" });
  }
});

// ✏️ Modifier un article
app.put("/api/stock/:index", (req, res) => {
  const idx = parseInt(req.params.index);
  const updatedRow = req.body;
  if (isNaN(idx) || !Array.isArray(updatedRow) || updatedRow.length < 4) {
    return res.status(400).json({ error: "Format ou index invalide" });
  }
  try {
    const data = readExcel();
    if (idx < 0 || idx >= data.length) {
      return res.status(404).json({ error: "Index hors limites" });
    }
    data[idx] = updatedRow;
    writeExcel(data);
    res.json({ success: true });
  } catch (err) {
    console.error("Erreur modification:", err);
    res.status(500).json({ error: "Erreur modification" });
  }
});

// ❌ Supprimer un article
app.delete("/api/stock/:index", (req, res) => {
  const idx = parseInt(req.params.index);
  if (isNaN(idx)) {
    return res.status(400).json({ error: "Index invalide" });
  }
  try {
    const data = readExcel();
    if (idx < 0 || idx >= data.length) {
      return res.status(404).json({ error: "Index hors limites" });
    }
    data.splice(idx, 1);
    writeExcel(data);
    res.json({ success: true });
  } catch (err) {
    console.error("Erreur suppression:", err);
    res.status(500).json({ error: "Erreur suppression" });
  }
});

// Démarrage serveur
const PORT = process.env.PORT || 4000; // Utilise le port de Render ou 4000 en local;
app.listen(PORT, () => {
  console.log(`✅ Backend en cours sur : http://localhost:${PORT}`);
});
