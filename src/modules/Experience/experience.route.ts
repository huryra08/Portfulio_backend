import { Router } from "express";
import { experienceController } from "./experience.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.get("/", experienceController.getAllExperience);

// Admin only
router.post("/", auth("ADMIN"), experienceController.createExperience);
router.put("/:id", auth("ADMIN"), experienceController.updateExperience);
router.delete("/:id", auth("ADMIN"), experienceController.deleteExperience);

export const experienceRoutes = router;
