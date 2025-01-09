export interface Recipe {
  id: number;
  title: string;
  image: string;
  summary: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  extendedIngredients: Ingredient[];
  instructions: string;
  nutrition: Nutrition;
}

export interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  image: string;
}

export interface Nutrition {
  nutrients: Nutrient[];
}

export interface Nutrient {
  name: string;
  amount: number;
  unit: string;
}
