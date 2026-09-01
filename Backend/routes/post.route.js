import express from "express";

import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { upload } from "../middleware/multer.js";
import {
  createPost,
  deletePost,
  dislikePost,
  getAllPosts,
  getPostByUserId,
  getUserPost,
  likePost,
  updatePost,
} from "../controllers/post.controllers.js";

const router = express.Router();

router.post("/create", isAuthenticated, upload.single("file"), createPost);
router.get("/getallpost", getAllPosts);
router.get("/getuserpost", getUserPost);
router.get("/:userId", getPostByUserId);
router.put("/update-post/:postId", upload.single("file"), updatePost);
router.get("/:id/like", isAuthenticated, likePost);
router.get("/:id/dislike", isAuthenticated, dislikePost);
router.delete("/:id", isAuthenticated, deletePost);

export default router;
