import express from "express";
import {
  createExam,
  deleteExam,
  viewExam,
} from "../controllers/examController.js";
import authenticateToken from "../utils/authorization.js";

const router = express.Router();

router.post("/create", authenticateToken, createExam);
router.post("/delete", authenticateToken, deleteExam);
router.post("/view", authenticateToken, viewExam);

export default router;
