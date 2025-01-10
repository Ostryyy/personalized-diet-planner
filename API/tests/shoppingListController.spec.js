import { test, expect } from "@playwright/test";
import fs from "fs";

let token;

test.describe("Shopping List Controller Tests", () => {
  test.beforeAll(() => {
    const authData = JSON.parse(fs.readFileSync("auth-token.json", "utf-8"));
    token = authData.token;
  });

  test("Add Recipe to Shopping List", async ({ request }) => {
    const response = await request.post("/api/shopping-list/add-recipe", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        items: [
          {
            ingredientId: 1,
            name: "Tomato",
            amount: 2,
            unit: "pcs",
            image: "tomato.jpg",
          },
          {
            ingredientId: 2,
            name: "Cucumber",
            amount: 1,
            unit: "pcs",
            image: "cucumber.jpg",
          },
        ],
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.message).toBe("Shopping list updated successfully");
    expect(responseBody.shoppingList.items.length).toBeGreaterThanOrEqual(2);
  });

  test("Get Shopping List", async ({ request }) => {
    const response = await request.get("/api/shopping-list", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty("items");
    expect(responseBody.items.length).toBeGreaterThanOrEqual(1);
  });

  test("Remove Item from Shopping List", async ({ request }) => {
    const ingredientId = 1;
    const response = await request.delete(
      `/api/shopping-list/remove-item/${ingredientId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.message).toBe("Item removed from shopping list");
    expect(
      responseBody.shoppingList.items.find(
        (item) => item.ingredientId === ingredientId
      )
    ).toBeUndefined();
  });

  test("Reset Shopping List", async ({ request }) => {
    const response = await request.post("/api/shopping-list/reset", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.message).toBe("Shopping list reset successfully");
    expect(responseBody.shoppingList.items.length).toBe(0);
  });
});
