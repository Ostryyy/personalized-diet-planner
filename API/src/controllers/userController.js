import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { getSpoonacularToken } from "../services/spoonacularService.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const registerUser = async (req, res) => {
  const { username, firstName, lastName, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    let spoonacularResponse;
    try {
      spoonacularResponse = await getSpoonacularToken(
        username,
        firstName,
        lastName,
        email
      );
    } catch (error) {
      return res.status(401).json({
        message: "Failed to connect to API. User not created.",
        error: error.message,
      });
    }

    const user = await User.create({
      username,
      firstName,
      lastName,
      email,
      password,
      spoonacularUsername: spoonacularResponse.username,
      spoonacularHash: spoonacularResponse.hash,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      weight: user.weight,
      height: user.height,
      goal: user.goal,
      goalsSet: user.goalsSet,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export const updateUserProfile = async (req, res) => {
  const userId = req.user.id;

  const { weight, height, goal } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.weight = weight || user.weight;
    user.height = height || user.height;
    user.goal = goal || user.goal;

    if (weight || height || goal) {
      user.goalsSet = true;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      weight: updatedUser.weight,
      height: updatedUser.height,
      goal: updatedUser.goal,
      goalsSet: updatedUser.goalsSet,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    await user.remove();
    res.status(204).json({ message: "User account removed successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};
