import express from "express";
import { getCampaigns, getCampaignById, createCampaign, updateCampaign } from "../controllers/campaignController.js";

const router = express.Router();

router.get("/", getCampaigns);
router.get("/:id", getCampaignById);
router.post("/", createCampaign);
router.post("/:id", updateCampaign);

export default router;