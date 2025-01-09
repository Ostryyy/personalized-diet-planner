export interface Meal {
  id: number;
  imageType: string;
  title: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
}

export interface Nutrients {
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
}

export interface DailyMealPlan {
  meals: Meal[];
  nutrients: Nutrients;
}

export interface WeeklyMealPlan {
  [day: string]: DailyMealPlan;
}
