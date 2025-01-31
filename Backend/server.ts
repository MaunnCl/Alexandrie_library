import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route";
import authRoutes from "./routes/auth.route";
import { setupSwagger } from "./docs/swagger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", authRoutes);

// Ajout de Swagger
setupSwagger(app);

app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📄 Swagger disponible sur http://localhost:${PORT}/api-docs`);
});
