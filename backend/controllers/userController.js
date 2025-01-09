import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const loginUser = async (req, res) => {
  try {
    const { email, password, isadmin } = req.body;

    const user = await User.findOne({ email, isadmin });
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials!" });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        const token = jwt.sign(
          {
            name: user.name,
            email: email,
            userId: user._id,
            isadmin: user.isadmin,
          },
          "ncircle",
          {
            expiresIn: "1h",
          }
        );

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
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, isadmin } = req.body;

    const existingUser = await User.findOne({
      email: email,
      isadmin: isadmin,
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hash, isadmin });

    const token = jwt.sign(
      {
        name: user.name,
        email: email,
        userId: user._id,
        isadmin: user.isadmin,
      },
      "ncircle",
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(201).json({ _id: user._id, isadmin: user.isadmin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({ message: "Logged out successfully." });
};
