import express from "express";
import {
  registerUser,
  loginUser,
  updateUserProfile,
  getUserProfile,
  deleteUser,
  updateUserWeight,
} from "../controllers/userController.js";
import { protect } from "../utils/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", protect, getUserProfile);

router.put("/profile", protect, updateUserProfile);

router.put("/weight", protect, updateUserWeight);

router.delete("/delete", protect, deleteUser);

export default router;
