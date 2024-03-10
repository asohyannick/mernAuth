import express from "express";
import user from "../controllers/user.controller.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/auth", user.authUser);
router.post("/register", user.registerUser);
router.post("/logout", user.logoutUser);
router
  .route("/profile")
  .get(protect, user.getUserProfile)
  .put(protect, user.updateUserProfile);
router.delete("/delete", protect, user.deleteUserProfile);
export default router;
