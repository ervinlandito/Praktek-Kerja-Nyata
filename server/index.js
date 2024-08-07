import express from "express";
import bodyParser from "body-parser";
import router from "../routes/data_routes.js";
import { startScheduler } from '../helper/cron-scheduler.js';
import dotenv from "dotenv";
dotenv.config();

const app = express();  

const PORT = process.env.PORT

app.use(bodyParser.json());
app.use(router);

startScheduler()

app.listen(PORT, () =>
  console.log(`Server berjalan di http://localhost:${PORT}`)
);
