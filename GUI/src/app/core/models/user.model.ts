export interface WeightEntry {
  weight: number;
  date: Date;
}

export interface MealPlan {
  date: Date;
  plan: Record<string, any>;
}

export interface User {
  id?: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  token?: string;
  age?: number | null;
  gender?: 'male' | 'female' | 'other' | null;
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very active';
  spoonacularUsername?: string;
  spoonacularHash?: string;
  weight?: number;
  height?: number;
  goal?: 'lose' | 'gain' | 'maintain';
  goalsSet: boolean;
  mealPlans?: MealPlan;
  weightHistory?: WeightEntry[];
  excludes?: string[];
  dailyCalories?: number | null;
  dietType?:
    | 'balanced'
    | 'low-carb'
    | 'high-protein'
    | 'vegan'
    | 'vegetarian'
    | 'keto';
  createdAt?: Date;
  updatedAt?: Date;
}
