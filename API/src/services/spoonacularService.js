import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const SPOONACULAR_BASE_URL = "https://api.spoonacular.com/users/connect";
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

export const getSpoonacularToken = async (
  username,
  firstName,
  lastName,
  email
) => {
  try {
    const response = await axios.post(
      `${SPOONACULAR_BASE_URL}`,
      {
        username,
        firstName,
        lastName,
        email,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.SPOONACULAR_API_KEY,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    throw new Error("Failed to connect to Spoonacular API");
  }
};

export const generateMealPlan = async (diet, calories, excludes) => {
  try {
    const response = await axios.get(
      `https://api.spoonacular.com/mealplanner/generate`,
      {
        params: {
          timeFrame: "week",
          targetCalories: calories,
          diet: diet,
          exclude: excludes,
          apiKey: SPOONACULAR_API_KEY,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Spoonacular API Error:", error.response.data);
      throw new Error(
        `Spoonacular API Error: ${error.response.status} - ${error.response.data.message}`
      );
    } else if (error.request) {
      console.error("No response from Spoonacular API:", error.request);
      throw new Error("No response from Spoonacular API.");
    } else {
      console.error("Error setting up the request:", error.message);
      throw new Error("Error setting up the request.");
    }
  }
};