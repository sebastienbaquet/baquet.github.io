// On importe le framework express
import express from "express";

// Importe un module de nodes qui permet de convertir un URL en path
import { fileURLToPath } from 'url';

// Importe le module "path" de nodes qui permet de travailler avec des chemins
import path from 'path';

// import.meta.url produit l'url du fichier
const __filename = fileURLToPath(import.meta.url);

// Extrait la partie chemin du fichier
const __dirname = path.dirname(__filename);

// Créer une instance de l'app express qui permettra de lancer le serveur
const app = express();

// Défini le port
const port = 8080;

// Génère le chemin vers le dossier public avec les MIME types appropriés
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath);
    if (ext === '.css') {
      res.setHeader('Content-Type', 'text/css');
    } else if (ext === '.js') {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Défini la route pour l'url ('/')
app.get('/', (req, res) => {
  // Envoie la page index.html
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Démarre le serveur
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});