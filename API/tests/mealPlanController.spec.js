import { test, expect } from "@playwright/test";
import fs from "fs";

let token;

test.describe("Meal Plan Controller Tests", () => {
  test.beforeAll(() => {
    const authData = JSON.parse(fs.readFileSync("auth-token.json", "utf-8"));
    token = authData.token;
  });

  test("Generate Meal Plan for User", async ({ request }) => {
    const response = await request.post("/api/meal-plans/generate", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody.message).toBe("Meal plan generated successfully");
    expect(responseBody).toHaveProperty("mealPlan");
  });

  test("Get Meal Plan for User", async ({ request }) => {
    const response = await request.get("/api/meal-plans", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.message).toBe("Meal plan retrieved successfully");
    expect(responseBody).toHaveProperty("mealPlan");
  });

  test("Get Recipe Details", async ({ request }) => {
    const recipeId = 716429;
    const response = await request.get(`/api/meal-plans/recipes/${recipeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty("id", recipeId);
  });
});
