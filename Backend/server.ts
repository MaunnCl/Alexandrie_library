import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import userRoutes from "./routes/user";


dotenv.config();

const app = express();
const port = process.env.PORT;

// Middleware pour parser le JSON
app.use(express.json());
app.use("/api/users", userRoutes);

app.get("/test", (req, res) => {
    res.json({ message: "Hello World" });
});

// Lancer le serveur
async function startServer() {
    await connectDB();
    //await sequelize.sync({ alter: true });
    app.listen(port, () => console.log(`🚀 Serveur démarré sur http://localhost:${port}`));
}

startServer();