import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import mealPlanRoutes from "./routes/mealPlanRoutes.js";
import shoppingListRoutes from "./routes/shoppingListRoutes.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost",
};

app.use(cors(corsOptions));

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/meal-plans", mealPlanRoutes);
app.use("/api/shopping-list", shoppingListRoutes);

export default app;
