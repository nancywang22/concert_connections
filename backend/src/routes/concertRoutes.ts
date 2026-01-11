import { Router } from "express";
import { logConcertHandler } from "../controllers/concertController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

// POST /concerts/log -> log concert & post
router.post("/log", requireAuth, logConcertHandler);

export default router;
