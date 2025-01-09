import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./utils/database.js";
import userRoutes from "./routes/userRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Database Connection
connectDB();

// Routes
app.use("/user", userRoutes);
app.use("/exam", examRoutes);
app.use("/result", resultRoutes);

app.get("/", (req, res) => {
  res.send("Home Page");
});

export default app;
