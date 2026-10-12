import { Router } from "express";
import rateLimit from "express-rate-limit";
import { messageController } from "./message.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, statusCode: 429, message: "Too many messages, please try again later" },
});

// Public contact form
router.post("/", contactLimiter, messageController.createMessage);

// Admin only
router.get("/", auth("ADMIN"), messageController.getAllMessages);
router.patch("/:id/read", auth("ADMIN"), messageController.markAsRead);
router.delete("/:id", auth("ADMIN"), messageController.deleteMessage);

export const messageRoutes = router;
