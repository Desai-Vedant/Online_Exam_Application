import express from "express";
import {
  createResult,
  deleteResult,
  viewResult,
} from "../controllers/resultController.js";

const router = express.Router();

router.post("/create", createResult);
router.post("/delete", deleteResult);
router.post("/view", viewResult);

export default router;
