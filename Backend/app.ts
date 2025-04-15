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
