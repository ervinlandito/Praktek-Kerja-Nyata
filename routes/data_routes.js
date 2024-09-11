import express from "express";
import { getDataRealisasi } from "../controllers/datakecamatan.js";
import { postDataPerumahan } from "../controllers/dataPerumahan.js";
import { postDataSiharkepo } from "../controllers/siharkepo.js";
import { postDatakomoditi } from "../controllers/komoditi.js";
import { postDataStunting } from "../controllers/stunting.js";

const router = express.Router();
router.post("/api/data-realisasi", getDataRealisasi);
router.post("/api/data-perumahan", postDataPerumahan);
router.post("/api/siharkepo", postDataSiharkepo);
router.post("/api/komoditi", postDatakomoditi);
router.post("/api/stunting", postDataStunting);

export default router;
