import { test, expect } from "@playwright/test";
import fs from "fs";

let token;
test.beforeAll(() => {
  const authData = JSON.parse(fs.readFileSync("auth-token.json", "utf-8"));
  token = authData.token;
});

test.describe("User Controller API Tests", () => {
  test("Get user profile", async ({ request }) => {
    const response = await request.get("/api/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty("username", "test_user");
  });

  test("Update user profile", async ({ request }) => {
    const response = await request.put("/api/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        weight: 75,
        height: 180,
        goal: "lose",
        age: 25,
        gender: "female",
        activityLevel: "moderate",
      },
    });
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.weight).toBe(75);
    expect(responseBody.height).toBe(180);
    expect(responseBody.goal).toBe("lose");
  });

  test("Update user weight", async ({ request }) => {
    const response = await request.put("/api/users/weight", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        weight: 80,
      },
    });
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody.message).toBe("Weight updated successfully");

    const lastEntry =
      responseBody.weightHistory[responseBody.weightHistory.length - 1];
    expect(lastEntry.weight).toBe(80);
    expect(new Date(lastEntry.date)).not.toBeNaN();
  });
});
