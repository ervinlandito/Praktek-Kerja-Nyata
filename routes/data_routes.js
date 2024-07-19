import express from "express";
import {
  getDataRealisasi,
} from "../controllers/dataController.js";

const router = express.Router();
router.post("/api/data-realisasi", getDataRealisasi);
export default router;
