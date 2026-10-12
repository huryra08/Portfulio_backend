import { Router } from "express";
import { profileController } from "./profile.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.get("/", profileController.getProfile);

// Admin only
router.put("/", auth("ADMIN"), profileController.updateProfile);

export const profileRoutes = router;
