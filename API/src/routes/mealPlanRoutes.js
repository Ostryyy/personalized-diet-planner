import express from "express";
import {
  generateMealPlanForUser,
  getRecipeDetails,
  getMealPlanForUser,
} from "../controllers/mealPlanController.js";
import { protect } from "../utils/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMealPlanForUser);

router.post("/generate", protect, generateMealPlanForUser);

router.get("/recipes/:recipeId", protect, getRecipeDetails);

export default router;
