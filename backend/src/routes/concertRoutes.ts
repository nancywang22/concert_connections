import { Router } from "express";
import { concertsByArtistHandler, logConcertHandler } from "../controllers/concertController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

// GET /concerts/:id/concerts -> fetch concerts from Setlist.fm
router.get("/:id/concerts", concertsByArtistHandler);

// POST /concerts/log -> log concert & post
router.post("/log", requireAuth, logConcertHandler);

export default router;
