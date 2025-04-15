import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./src/routes/auth.route.ts";
import userRoutes from "./src/routes/user.route.ts";
import userProfileRoutes from "./src/routes/userProfile.route.ts";
import roleRoutes from "./src/routes/roleList.route.ts";
import usersRolesRoutes from "./src/routes/userRole.route.ts";
import oratorsRoutes from "./src/routes/orators.route.ts";
import contentsRoutes from "./src/routes/content.route.ts";
import congressRoutes from "./src/routes/congress.route.ts";
import sessionRoutes from "./src/routes/session.route.ts";
import { setupSwagger } from "./docs/swagger";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use((req: express.Request, res, next) => {
  const time = new Date().toString();
  console.log(req.method, req.hostname, req.path, time);
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

setupSwagger(app);

export default app;
