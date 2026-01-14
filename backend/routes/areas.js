import express from "express";
import { getAreas, getAreaById, createArea, getAreaTypes } from "../controllers/areaController.js";

const router = express.Router();


router.get("/types", getAreaTypes);
router.get("/area/:id", getAreaById);
router.get("/:id", getAreas);
router.post("/", createArea);

export default router;