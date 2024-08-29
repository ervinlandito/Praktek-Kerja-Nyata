import express from "express";
import { getDataRealisasi } from "../controllers/datakecamatan.js";
import { postDataPerumahan } from "../controllers/dataPerumahan.js";
import { postDataSiharkepo } from "../controllers/siharkepo.js";
import { postDatakomoditi } from "../controllers/komoditi.js";

const router = express.Router();
router.post("/api/data-realisasi", getDataRealisasi);
router.post("/api/data-perumahan", postDataPerumahan);
router.post("/api/siharkepo", postDataSiharkepo);
router.post("/api/komoditi", postDatakomoditi);

export default router;
