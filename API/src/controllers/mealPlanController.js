import { generateMealPlan } from "../services/spoonacularService.js";
import User from "../models/userModel.js";

export const generateMealPlanForUser = async (req, res) => {
  const { diet, calories, excludes } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const mealPlan = await generateMealPlan(diet, calories, excludes);

    user.mealPlans = {
      date: new Date(),
      plan: mealPlan.week,
    };

    await user.save();

    res.status(201).json({
      message: "Meal plan generated successfully",
      mealPlan: mealPlan.week,
    });
  } catch (error) {
    console.error("Error generating meal plan:", error);
    res.status(500).json({ message: error.message });
  }
};
