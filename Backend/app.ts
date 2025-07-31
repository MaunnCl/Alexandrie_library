import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./src/routes/users.route";
import userRolesRoutes from "./src/routes/usersRoles.route";
import userProfilesRoutes from "./src/routes/usersProfiles.route";
import roleRoutes from "./src/routes/role.route";
import oratorsRoutes from "./src/routes/orators.route";
import contentsRoutes from "./src/routes/content.route";
import congressRoutes from "./src/routes/congress.route";
import sessionRoutes from "./src/routes/session.route";
import historyRoutes from "./src/routes/history.route";
import { setupSwagger } from "./docs/swagger";

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use((req: express.Request, res, next) => {
  const time = new Date().toString();
  console.log(req.method, req.hostname, req.path, time);
  next();
});

app.use("/api", userRoutes);
app.use("/api", userRolesRoutes);
app.use("/api", userProfilesRoutes);
app.use("/api", roleRoutes);
app.use("/api", oratorsRoutes);
app.use("/api", contentsRoutes);
app.use("/api", congressRoutes);
app.use("/api", sessionRoutes);
app.use("/api", historyRoutes);
setupSwagger(app);

export default app;
