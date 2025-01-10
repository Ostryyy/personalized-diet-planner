export interface ShoppingListItem {
  ingredientId: number;
  name: string;
  amount: number;
  unit: string;
  image?: string;
}

export interface ShoppingList {
  userId: string;
  items: ShoppingListItem[];
  date: Date;
}
