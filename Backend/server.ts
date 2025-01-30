import express, {Request, Response} from "express";
import dotenv from "dotenv";
//const { connectDB, sequelize } = require("./config/database");

dotenv.config();

const app = express();
const port = process.env.PORT;

// Middleware pour parser le JSON
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello World" }).status(200);
});

// Lancer le serveur
async function startServer() {
    //await connectDB();
    //await sequelize.sync({ alter: true });
    app.listen(port, () => console.log(`🚀 Serveur démarré sur http://localhost:${port}`));
}

startServer();