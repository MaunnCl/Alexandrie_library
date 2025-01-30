const express = require("express");
const app = express();
const port = 8080;

// Middleware pour parser le JSON
app.use(express.json());

// Lancer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
