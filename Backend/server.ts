import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route";

dotenv.config();

const app = express();
const port = process.env.PORT;

// Middleware pour parser le JSON
app.use(express.json());
app.use("/api", userRoutes);

//server automatically connected to the database when it starts
app.listen(port, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
});
