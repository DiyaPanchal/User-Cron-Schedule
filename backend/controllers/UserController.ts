import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv/config";
import User from "../models/User";

const secretKey = process.env.SECRET_KEY as string;

export const userLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    if (user.status === "inactive") {
      user.status = "active";
      await user.save();
      console.log(`User ${email} status updated to active.`);
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: "1h" });

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in user", error });
  }
};

export const userRegister = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists. Please log in!" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      status: "active", 
      lastLogin: new Date(), 
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully!", user });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering the user", error });
  }
};

export const userLogout = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    res.status(200).json({ message: "Logout successful!" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Error logging out user" });
  }
};
