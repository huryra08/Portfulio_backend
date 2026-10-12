import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authController } from "./auth.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, statusCode: 429, message: "Too many attempts, please try again later" },
});

router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);
router.post("/logout", authController.logout);
router.get("/me", auth(), authController.getMe);

export const authRoutes = router;
