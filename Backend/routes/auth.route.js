import express from "express";

import {
  getCurrentUser,
  getProfile,
  loginUser,
  logoutUser,
  registerUser,
  updateCoverPhoto,
  updateIntro,
  updateProfilePhoto,
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  unfriendUser,
  searchUsers,
  followUser,
  unfollowUser,
} from "../controllers/auth.controller.js";

import { isAuthenticated } from "../middleware/isAuthenticated.js";

import { upload } from "../middleware/multer.js";

const router = express.Router();


// ==================== AUTH ====================

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/logout", logoutUser);

router.get(
  "/me",
  isAuthenticated,
  getCurrentUser
);


// ==================== PROFILE ====================

router.get(
  "/profile/:id",
  getProfile
);

router.put(
  "/update/profile-pic",
  isAuthenticated,
  upload.single("file"),
  updateProfilePhoto
);

router.put(
  "/update/cover-pic",
  isAuthenticated,
  upload.single("file"),
  updateCoverPhoto
);

router.put(
  "/update-intro",
  isAuthenticated,
  updateIntro
);


// ==================== FRIEND REQUEST ====================

router.put(
  "/request/send/:id",
  isAuthenticated,
  sendFriendRequest
);

router.get(
  "/request/list",
  isAuthenticated,
  getFriendRequests
);

router.put(
  "/request/accept/:id",
  isAuthenticated,
  acceptFriendRequest
);

router.put(
  "/request/reject/:id",
  isAuthenticated,
  rejectFriendRequest
);

router.put(
  "/request/unfriend/:id",
  isAuthenticated,
  unfriendUser
);


// ==================== FOLLOW ====================

router.put(
  "/follow/:id",
  isAuthenticated,
  followUser
);

router.put(
  "/unfollow/:id",
  isAuthenticated,
  unfollowUser
);


// ==================== SEARCH ====================

router.get(
  "/search",
  isAuthenticated,
  searchUsers
);


export default router;