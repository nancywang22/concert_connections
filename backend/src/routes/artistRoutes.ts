import { Router } from "express";
import { artistSearchHandler, concertsByArtistHandler } from "../controllers/artistController";

const router = Router();

// GET /artists/search?q=Taylor%20Swift
router.get("/search", artistSearchHandler);

// GET /artists/:artistId/concerts
router.get("/:artistId/concerts", concertsByArtistHandler);

export default router;
