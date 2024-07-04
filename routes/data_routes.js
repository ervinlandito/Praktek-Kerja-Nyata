import express from "express";
import {
  createDataKecamatan,
  getAllDataKecamatan,
} from "../controllers/dataController.js";

const router = express.Router();

router.get("/api/data_kecamatan", getAllDataKecamatan);
router.post("/api/data_kecamatan", createDataKecamatan);

export default router;
