import express from "express";
import dotenv from "dotenv";


dotenv.config();

const app = express();
const port = process.env.PORT;

// Middleware pour parser le JSON
app.use(express.json());

app.get("/test", (req, res) => {
    res.json({ message: "Hello World" });
});

// Lancer le serveur
//server automatically connected to the database when it starts
async function startServer() {
    //await sequelize.sync({ alter: true });
    app.listen(port, () => console.log(`🚀 Serveur démarré sur http://localhost:${port}`));
}

startServer();
