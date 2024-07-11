import cron from "node-cron";
import DataKecamatan from "../model/dataModel.js";
import { getDataRealisasi } from "../controllers/dataController.js";
import axios from "axios";

let cronJobData = null;

const addToDatabase = async () => {
  if (cronJobData) {
    try {
      await DataKecamatan.create(cronJobData);
      console.log(`Data successfully added into database`);
      cronJobData = null;
    } catch (error) {
      console.error(`Cannot store data into database`);
    }
  } else {
    console.log(`No data is added to database`);
  }
};

export function startScheduler(params) {
  cron.schedule(
    "55 23 * * *",
    () => {
      console.log(`Run a cronJob to add to Database`);
      getDataRealisasi()
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
