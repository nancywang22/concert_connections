import { Router } from "express";
import { artistSearchHandler } from "../controllers/artistController";

const router = Router();

// GET /artists/search?q=Coldplay
router.get("/search", artistSearchHandler);

export default router;
