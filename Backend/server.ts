import router from "../Backend/routes/user.route";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import userProfileRoutes from "./routes/userProfile.route";
import roleRoutes from "./routes/roleList.route";
import usersRolesRoutes from "./routes/userRole.route";
import contentRoutes from "./routes/content.route"
import { setupSwagger } from "./docs/swagger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors())
app.use("/api", router);
app.use((req: express.Request, res, next) =>{
    const time = new Date(Date.now()).toString();
    console.log(req.method,req.hostname, req.path, time);
    next();
});
app.use("/api", authRoutes);
app.use("/users", userRoutes);
app.use("/profiles", userProfileRoutes);
app.use("/roles", roleRoutes);
app.use("/users-roles", usersRolesRoutes);
app.use("/contents", contentRoutes);

// Ajout de Swagger
setupSwagger(app);

app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📄 Swagger disponible sur http://localhost:${PORT}/api-docs`);
});
