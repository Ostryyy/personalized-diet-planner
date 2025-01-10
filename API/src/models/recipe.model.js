import mongoose from "mongoose";

const ingredientSchema = mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  unit: { type: String, required: true },
});

const stepSchema = mongoose.Schema({
  stepNumber: { type: Number, required: true },
  instruction: { type: String, required: true },
});

const recipeSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Recipe title is required"],
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    ingredients: {
      type: [ingredientSchema],
      required: [true, "Ingredients are required"],
    },
    steps: {
      type: [stepSchema],
      required: [true, "Steps are required"],
    },
    preparationTime: {
      type: Number,
      required: [true, "Preparation time is required"],
    },
    cookingTime: {
      type: Number,
      required: [true, "Cooking time is required"],
    },
    servings: {
      type: Number,
      required: [true, "Number of servings is required"],
    },
    caloriesPerServing: {
      type: Number,
      required: [true, "Calories per serving is required"],
    },
    dietType: {
      type: String,
      enum: ["balanced", "low-carb", "high-protein", "vegan", "vegetarian", "keto"],
      default: "balanced",
    },
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
