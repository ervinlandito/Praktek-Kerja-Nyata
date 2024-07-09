import express from "express";
import {
  createDataKecamatan,
  getAllDataKecamatan,
  getDataRealisasi,
} from "../controllers/dataController.js";

const router = express.Router();

router.get("/api/data_kecamatan", getAllDataKecamatan);
router.post("/api/data_kecamatan", createDataKecamatan);
router.post("/api/data-realisasi", getDataRealisasi);


export default router;
