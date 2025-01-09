import mongoose from 'mongoose';

const ShoppingListItemSchema = new mongoose.Schema({
  ingredientId: { type: Number, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  unit: { type: String, required: true },
  image: { type: String }
});

const ShoppingListSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [ShoppingListItemSchema],
  date: { type: Date, default: Date.now }
});

const ShoppingList = mongoose.model('ShoppingList', ShoppingListSchema);
export default ShoppingList;
