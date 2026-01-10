import { Router } from "express";
import {
  logConcertHandler,
  getUserConcertsHandler,
} from "../controllers/concertController";
import { getConcertsForArtistHandler } from "../controllers/concertController";

import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.post("/", requireAuth, logConcertHandler);
router.get("/my", requireAuth, getUserConcertsHandler);
router.get("/artist/:setlistFmId", getConcertsForArtistHandler);
export default router;
