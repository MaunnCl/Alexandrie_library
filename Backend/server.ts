import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.route.ts";
import userRoutes from "./routes/user.route.ts";
import userProfileRoutes from "./routes/userProfile.route.ts";
import roleRoutes from "./routes/roleList.route";
import usersRolesRoutes from "./routes/userRole.route";
import oratorsRoutes from "./routes/orators.route";
import contentsRoutes from "./routes/content.route";
import congressRoutes from "./routes/congress.route";
import sessionRoutes from "./routes/session.route";
import { setupSwagger } from "./docs/swagger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors())
app.use("/api", userRoutes);
app.use((req: express.Request, res, next) =>{
    const time = new Date(Date.now()).toString();
    console.log(req.method,req.hostname, req.path, time);
    next();
});
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", userProfileRoutes);
app.use("/api", roleRoutes);
app.use("/api", usersRolesRoutes);
app.use("/api", oratorsRoutes);
app.use("/api", contentsRoutes);
app.use("/api", congressRoutes);
app.use("/api", sessionRoutes);
// Ajout de Swagger
setupSwagger(app);

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
      console.log(`📄 Swagger disponible sur http://localhost:${PORT}/api-docs`);
    });
  }

export default app;
