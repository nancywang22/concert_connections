import { Router } from "express";
import { logConcertHandler, getArtistConcertsHandler, getUserOverlapsHandler } from "../controllers/concertController";

const router = Router();

// Log a concert or add memory
router.post("/log", logConcertHandler);

// Get all concerts for an artist
router.get("/artist/:artistId", getArtistConcertsHandler);

// Get overlaps for a user
router.get("/overlaps/:userId", getUserOverlapsHandler);

export default router;
