import { Router } from "express";
import { educationController } from "./education.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.get("/", educationController.getAllEducation);

// Admin only
router.post("/", auth("ADMIN"), educationController.createEducation);
router.put("/:id", auth("ADMIN"), educationController.updateEducation);
router.delete("/:id", auth("ADMIN"), educationController.deleteEducation);

export const educationRoutes = router;
