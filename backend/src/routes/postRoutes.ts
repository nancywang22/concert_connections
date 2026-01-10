import { Router } from "express";
import {
  createPostHandler,
  getPostsForConcertHandler,
} from "../controllers/postController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.post("/", requireAuth, createPostHandler);
router.get("/:concertId", getPostsForConcertHandler);

export default router;
