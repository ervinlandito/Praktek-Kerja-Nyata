import express from "express";
import { getDataRealisasi } from "../controllers/dataController.js";
import { postDataPerumahan } from "../controllers/dataPerumahan.js";

const router = express.Router();
router.post("/api/data-realisasi", getDataRealisasi);
router.post("/api/data-perumahan", postDataPerumahan);
export default router;
