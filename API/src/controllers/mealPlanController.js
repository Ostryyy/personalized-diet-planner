import {
  generateMealPlan,
  getRecipeInformation,
} from "../services/spoonacularService.js";
import User from "../models/userModel.js";

export const generateMealPlanForUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { dailyCalories } = calculateCalories(user);

    user.dailyCalories = dailyCalories;

    const mealPlan = await generateMealPlan(
      user.dietType,
      dailyCalories,
      user.excludes
    );

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

export const getMealPlanForUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.mealPlans || !user.mealPlans.plan || Object.keys(user.mealPlans.plan).length === 0) {
      return res.status(404).json({ message: "No meal plan found. Please generate a new one." });
    }

    res.status(200).json({
      message: "Meal plan retrieved successfully",
      mealPlan: user.mealPlans.plan,
    });
  } catch (error) {
    console.error("Error retrieving meal plan:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getRecipeDetails = async (req, res) => {
  const { recipeId } = req.params;

  if (!recipeId) {
    return res.status(400).json({ message: "Recipe ID is required" });
  }

  try {
    const recipe = await getRecipeInformation(recipeId);
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const calculateCalories = (user) => {
  const { weight, height, age, gender, goal, activityLevel } = user;

  let bmr;

  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else if (gender === "female") {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  } else {
    throw new Error("Invalid gender provided");
  }

  let tdee;
  switch (activityLevel) {
    case "sedentary":
      tdee = bmr * 1.2;
      break;
    case "light":
      tdee = bmr * 1.375;
      break;
    case "moderate":
      tdee = bmr * 1.55;
      break;
    case "active":
      tdee = bmr * 1.725;
      break;
    case "very active":
      tdee = bmr * 1.9;
      break;
    default:
      tdee = bmr * 1.2;
      break;
  }

  let dailyCalories;
  switch (goal) {
    case "maintain":
      dailyCalories = tdee;
      break;
    case "lose":
      dailyCalories = tdee * 0.8;
      break;
    case "gain":
      dailyCalories = tdee * 1.15;
      break;
    default:
      throw new Error("Invalid goal provided");
  }

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    dailyCalories: Math.round(dailyCalories),
  };
};
