// src/routes/mainRoutes.ts
import { Router } from "express";
import { getMainPageData } from "../controllers/mainController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

// GET /main -> returns posts + concert info
router.get("/", requireAuth, getMainPageData);

export default router;
