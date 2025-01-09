import express from "express";
import {
  createResult,
  deleteResult,
  viewResult,
} from "../controllers/resultController.js";
import authenticateToken from "../utils/authorization.js";

const router = express.Router();

router.post("/create", authenticateToken, createResult);
router.post("/delete", authenticateToken, deleteResult);
router.post("/view", authenticateToken, viewResult);

export default router;
