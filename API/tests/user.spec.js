import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:82";

test.describe("User API tests", () => {
  let token;

  test.beforeAll(async ({ request }) => {
    await request.post(`${BASE_URL}/api/users/register`, {
      data: {
        username: "test_user",
        firstName: "api",
        lastName: "test_user",
        email: "testuser@example.com",
        password: "password123",
      },
    });

    const loginResponse = await request.post(`${BASE_URL}/api/users/login`, {
      data: {
        email: "testuser@example.com",
        password: "password123",
      },
    });
    expect(loginResponse.status()).toBe(200);
    const loginBody = await loginResponse.json();
    token = loginBody.token;
  });

  test("Get user profile with token", async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty("username", "test_user");
  });

  test("Update user profile with token", async ({ request }) => {
    const response = await request.put(`${BASE_URL}/api/users/profile`, {
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

  test("Update user weight with token", async ({ request }) => {
    const newWeight = 80;

    const response = await request.put(`${BASE_URL}/api/users/weight`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        weight: newWeight,
      },
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    expect(responseBody.message).toBe("Weight updated successfully");

    const lastEntry =
      responseBody.weightHistory[responseBody.weightHistory.length - 1];
    expect(lastEntry.weight).toBe(newWeight);

    expect(new Date(lastEntry.date)).not.toBeNaN();
  });

  test("Register an existing user", async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/users/register`, {
      data: {
        username: "test_user",
        firstName: "api",
        lastName: "test_user",
        email: "testuser@example.com",
        password: "password123",
      },
    });

    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.message).toBe("User already exists");
  });

  test("Login with invalid password", async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/users/login`, {
      data: {
        email: "testuser@example.com",
        password: "wrongpassword",
      },
    });

    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe("Invalid email or password");
  });

  test("Delete user account with token", async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/api/users/delete`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    expect(response.status()).toBe(204);
  });
});
