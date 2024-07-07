import express from "express";
import {
  createCategory,
  getAllCategory,
} from "../controllers/catrgoryController.js";

const router = express.Router();

router.post("/create-category", createCategory);
router.get("/get-categories", getAllCategory);

export default router;
