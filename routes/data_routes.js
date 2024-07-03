import express from "express";
import {
  createDataKecamatan,
  getAllDataKecamatan,
} from "../controllers/dataController";

const router = express.Router();

router.get("/data_kecamatan", getAllDataKecamatan);
router.post("/data_kecamatan/:id", createDataKecamatan);

export default router;
