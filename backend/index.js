import express from "express";
import connectDB from "./utils/database.js";
import User from "./models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { authenticateToken } from "./utils/authorization.js";
import cors from "cors";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

connectDB();

app.get("/", async (req, res) => {
  res.send("Home Page");
});

app.post("/user/login", async (req, res) => {
  try {
    // Destructure Input
    const { email, password, isadmin } = req.body;

    // Check if user exists
    const user = await User.findOne({ email, isadmin });
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials!" });
    }

    // Check Password
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        const token = jwt.sign({ email: email, userId: user._id }, "ncircle", {
          expiresIn: "1h", // Token expiration (optional)
        });

        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });

        return res.status(200).json({ _id: user._id, isadmin: user.isadmin });
      } else {
        return res.status(401).json({ message: "Invalid Credentials!" });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post("/user/register", async (req, res) => {
  try {
    // Destructure Input
    const { name, email, password, isadmin } = req.body;

    // Check if user already Exist
    const existingUser = await User.findOne({ email: email, isadmin: isadmin });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists!" });
    }

    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create User
    const user = await User.create({ name, email, password: hash, isadmin });

    // Create Token
    const token = jwt.sign({ email: email, userId: user._id }, "ncircle", {
      expiresIn: "1h",
    });

    // Add token to cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(201).json({ _id: user._id, isadmin: user.isadmin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/user/logout", async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({ message: "Logged out successfully." });
});

app.listen(port, () => {
  console.log("Server Works!");
});
