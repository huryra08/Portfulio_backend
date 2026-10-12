import { Router } from "express";
import { skillController } from "./skill.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.get("/", skillController.getAllSkills);

// Admin only
router.post("/", auth("ADMIN"), skillController.createSkill);
router.put("/:id", auth("ADMIN"), skillController.updateSkill);
router.delete("/:id", auth("ADMIN"), skillController.deleteSkill);

export const skillRoutes = router;
