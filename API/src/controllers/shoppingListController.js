import ShoppingList from "../models/shoppingList.model.js";

export const addRecipeToShoppingList = async (req, res) => {
  const { items } = req.body;
  const userId = req.user.id;

  try {
    let shoppingList = await ShoppingList.findOne({ userId });
    if (!shoppingList) {
      shoppingList = new ShoppingList({ userId, items: [] });
    }

    items.forEach((ingredient) => {
      const existingItem = shoppingList.items.find(
        (item) => item.ingredientId === ingredient.ingredientId
      );

      if (existingItem) {
        existingItem.amount += ingredient.amount;
      } else {
        shoppingList.items.push({
          ingredientId: ingredient.ingredientId,
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          image: ingredient.image || "",
        });
      }
    });

    await shoppingList.save();

    res.status(200).json({
      message: "Shopping list updated successfully",
      shoppingList,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getShoppingList = async (req, res) => {
  const userId = req.user.id;

  try {
    const shoppingList = await ShoppingList.findOne({ userId });

    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    res.status(200).json(shoppingList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeItemFromShoppingList = async (req, res) => {
  const { ingredientId } = req.params;
  const userId = req.user.id;

  try {
    const shoppingList = await ShoppingList.findOne({ userId });

    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    shoppingList.items = shoppingList.items.filter(
      (item) => item.ingredientId !== parseInt(ingredientId)
    );

    await shoppingList.save();

    res.status(200).json({
      message: "Item removed from shopping list",
      shoppingList,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetShoppingList = async (req, res) => {
  const userId = req.user.id;

  try {
    const shoppingList = await ShoppingList.findOne({ userId });

    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    shoppingList.items = [];

    await shoppingList.save();

    res.status(200).json({
      message: "Shopping list reset successfully",
      shoppingList,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
