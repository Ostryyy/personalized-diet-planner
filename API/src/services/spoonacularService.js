import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const SPOONACULAR_BASE_URL = "https://api.spoonacular.com/users/connect";

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
