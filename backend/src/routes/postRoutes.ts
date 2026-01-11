import { Router } from "express";
import {
  createPostHandler,
  getPostsForConcertHandler,
  getAllPostsHandler,
} from "../controllers/postController";

const router = Router();

// Main feed
router.get("/", getAllPostsHandler);

// Posts for a specific concert
router.get("/:concertId", getPostsForConcertHandler);


export default router;
