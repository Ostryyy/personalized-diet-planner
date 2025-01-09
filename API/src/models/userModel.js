import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const weightEntrySchema = mongoose.Schema({
  weight: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const mealPlanSchema = mongoose.Schema({
  date: { type: Date, default: Date.now },
  plan: { type: Map, of: Object, default: {} },
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    age: {
      type: Number,
      default: null,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: null,
    },
    activityLevel: {
      type: String,
      enum: ["sedentary", "light", "moderate", "active", "very active"],
      default: "sedentary",
    },
    spoonacularUsername: {
      type: String,
      default: "",
    },
    spoonacularHash: {
      type: String,
      default: "",
    },
    token: {
      type: String,
      default: "",
    },
    weight: {
      type: Number,
    },
    height: {
      type: Number,
    },
    goal: {
      type: String,
      enum: ["lose", "gain", "maintain"],
      default: "maintain",
    },
    goalsSet: {
      type: Boolean,
      default: false,
    },
    mealPlans: {
      type: mealPlanSchema,
      default: { plan: {} },
    },
    weightHistory: [weightEntrySchema],
    excludes: {
      type: [String],
      default: [],
    },
    dailyCalories: {
      type: Number,
      default: null,
    },
    dietType: {
      type: String,
      enum: [
        "balanced",
        "low-carb",
        "high-protein",
        "vegan",
        "vegetarian",
        "keto",
      ],
      default: "balanced",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
