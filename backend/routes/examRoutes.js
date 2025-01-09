import express from "express";
import {
  createExam,
  deleteExam,
  viewExam,
} from "../controllers/examController.js";

const router = express.Router();

router.post("/create", createExam);
router.post("/delete", deleteExam);
router.post("/view", viewExam);

export default router;
