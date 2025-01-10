import { request } from "@playwright/test";
import { readFile } from "fs/promises";

export default async () => {
  const apiRequest = await request.newContext();

  const authData = JSON.parse(await readFile("auth-token.json", "utf-8"));
  const token = authData.token;

  const deleteResponse = await apiRequest.delete(
    "http://localhost:82/api/users/delete",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (deleteResponse.status() !== 204) {
    console.error("Failed to delete test user");
  } else {
    console.log("Test user deleted successfully");
  }
};
