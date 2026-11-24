import { Router } from "express";
import { certificateController } from "./certificate.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.get("/", certificateController.getAllCertificates);

// Admin only
router.post("/", auth("ADMIN"), certificateController.createCertificate);
router.put("/:id", auth("ADMIN"), certificateController.updateCertificate);
router.delete("/:id", auth("ADMIN"), certificateController.deleteCertificate);

export const certificateRoutes = router;
