import express from "express";
import {
  addRecipeToShoppingList,
  getShoppingList,
  removeItemFromShoppingList,
  resetShoppingList,
} from "../controllers/shoppingListController.js";
import { protect } from "../utils/authMiddleware.js";

const router = express.Router();

router.post("/add-recipe", protect, addRecipeToShoppingList);

router.get("/", protect, getShoppingList);

router.delete(
  "/remove-item/:ingredientId",
  protect,
  removeItemFromShoppingList
);

router.post("/reset", protect, resetShoppingList);

export default router;
