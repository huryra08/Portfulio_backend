import { Router } from "express";
import { projectController } from "./project.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.get("/", projectController.getAllProjects);

// Admin only (must stay above "/:slug" so "admin" is not read as a slug)
router.get("/admin/all", auth("ADMIN"), projectController.getAllProjectsAdmin);
router.post("/", auth("ADMIN"), projectController.createProject);
router.put("/:id", auth("ADMIN"), projectController.updateProject);
router.delete("/:id", auth("ADMIN"), projectController.deleteProject);

router.get("/:slug", projectController.getProjectBySlug);

export const projectRoutes = router;
