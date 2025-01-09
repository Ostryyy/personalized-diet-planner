import express from "express";
import { generateMealPlanForUser } from "../controllers/mealPlanController.js";
import { protect } from "../utils/authMiddleware.js";

const router = express.Router();

router.get("/", protect, generateMealPlanForUser);

export default router;
