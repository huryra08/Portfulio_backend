import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { authRoutes } from "./modules/auth/auth.routes";
import { projectRoutes } from "./modules/Project/project.route";
import { skillRoutes } from "./modules/Skill/skill.route";
import { profileRoutes } from "./modules/Profile/profile.route";
import { experienceRoutes } from "./modules/Experience/experience.route";
import { messageRoutes } from "./modules/Message/message.route";

const app: Application = express();

// needed so rate limiting sees the real client IP behind Vercel / proxies
app.set("trust proxy", 1);

app.use(cors({
    origin: config.app_url,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.send("Portfulio API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/messages", messageRoutes);

export default app;
