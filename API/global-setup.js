import { request } from "@playwright/test";
import { writeFile } from "fs/promises";

const BASE_URL = "http://localhost:82";

export default async () => {
  const apiRequest = await request.newContext();

  const registerResponse = await apiRequest.post(
    `${BASE_URL}/api/users/register`,
    {
      data: {
        username: "test_user",
        firstName: "api",
        lastName: "test_user",
        email: "testuser@example.com",
        password: "password123",
      },
    }
  );

  if (registerResponse.status() !== 201 && registerResponse.status() !== 400) {
    throw new Error("User registration failed!");
  }

  const loginResponse = await apiRequest.post(`${BASE_URL}/api/users/login`, {
    data: {
      email: "testuser@example.com",
      password: "password123",
    },
  });

  if (loginResponse.status() !== 200) {
    throw new Error("User login failed!");
  }

  const loginBody = await loginResponse.json();
  const token = loginBody.token;

  const updateUserProfileResponse = await apiRequest.put(
    `${BASE_URL}/api/users/profile`,
    {
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
    }
  );

  if (updateUserProfileResponse.status() !== 200) {
    throw new Error("User Profile Config Error!");
  }

  await writeFile("auth-token.json", JSON.stringify({ token }));
};
