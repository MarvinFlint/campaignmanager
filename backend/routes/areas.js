import express from "express";
import { getAreas, getAreaById, createArea } from "../controllers/areaController.js";

const router = express.Router();

router.get("/:id", getAreas);
router.get("/area/:id", getAreaById);
router.post("/", createArea);

export default router;