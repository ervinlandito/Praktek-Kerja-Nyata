import cron from "node-cron";
import DataKecamatan from "../model/dataModel.js";
import { getDataRealisasi } from "../controllers/dataController.js";
import axios from "axios";
import dotenv from "dotenv"

let cronJobData = null;
dotenv.config()

const addToDatabase = async () => {
  if (cronJobData) {
    try {
      await DataKecamatan.create(cronJobData);
      console.log(`Data successfully added into database`);
      cronJobData = null;
      logOperation({
        status: 'success',
        timestamp: moment().tz('Asia/Jakarta').format(),
        details: `Data successfully retrieved and saved for date ${tanggal}`
      });
    } catch (error) {
      console.error(`Cannot store data into database`);
      logOperation({
        status: 'error',
        timestamp: moment().tz('Asia/Jakarta').format(),
        details: `Data cannot retrieved`
      });
    }
  } else {
  }
};

export function startScheduler(params) {
  const scheduleTime = process.env.SCHEDULE_TIME
  cron.schedule(
   scheduleTime,
    () => {
      console.log(`Run a cronJob to add to Database`);
      // getDataRealisasi()
      axios.post('http://localhost:5000/api/data-realisasi')
      addToDatabase();
    },
    {
      scheduled: true,
      timezone: "Asia/Jakarta",
    }
  );
}

export const setCronJobData = (data) => {
  cronJobData = data;
};
