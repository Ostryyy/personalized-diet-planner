import express from "express";
import {
  generateMealPlanForUser,
  getRecipeDetails,
} from "../controllers/mealPlanController.js";
import { protect } from "../utils/authMiddleware.js";

const router = express.Router();

router.get("/", protect, generateMealPlanForUser);
router.get("/recipes/:recipeId", protect, getRecipeDetails);

export default router;
