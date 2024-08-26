import cron from "node-cron";
import DataKecamatan from "../model/dataModel.js";
import axios from "axios";
import dotenv from "dotenv";
import DataPerumahan from "../model/dataPerumahan.js";
import { getDataRealisasi } from "../controllers/dataController.js";
import { postDataPerumahan } from "../controllers/dataPerumahan.js";

let cronJobDataKecamatan = null;
let cronJobDataPerumahan = null;
dotenv.config();

const addToDatabase = async () => {
  if (cronJobDataKecamatan) {
    try {
      await DataKecamatan.create(cronJobDataKecamatan);
      console.log(`Data Kecamatan successfully added into database`);
      cronJobDataKecamatan = null;
      logOperation({
        status: "success",
        timestamp: moment().tz("Asia/Jakarta").format(),
        details: `Data Kecamatan successfully retrieved and saved for date ${tanggal}`,
      });
    } catch (error) {
      console.error(`Cannot store Data Kecamatan into database`);
      logOperation({
        status: "error",
        timestamp: moment().tz("Asia/Jakarta").format(),
        details: `Data Kecamatan cannot retrieved`,
      });
    }
  }

  if (cronJobDataPerumahan) {
    try {
      await DataPerumahan.create(cronJobDataPerumahan);
      console.log(`Data Perumahan successfully added into database`);
      cronJobDataPerumahan = null;
      logOperation({
        status: "success",
        timestamp: moment().tz("Asia/Jakarta").format(),
        details: `Data Perumahan successfully retrieved and saved for date${tanggal}`,
      });
    } catch (error) {
      console.error(`Cannot store Data Perumahan into database`);
      logOperation({
        status: "error",
        timestamp: moment().tz("Asia/Jakarta").format(),
        details: `Data Perumahan cannot retrieved`,
      });
    }
  }
};

export function startScheduler(params) {
  const scheduleTime = process.env.SCHEDULE_TIME;
  cron.schedule(
    scheduleTime,
    () => {
      console.log(`Run a cronJob to add to Database`);
      getDataRealisasi();
      postDataPerumahan();
      addToDatabase();
    },
    {
      scheduled: true,
      timezone: "Asia/Jakarta",
    }
  );
}

export const setCronJobDataKecamatan = (data) => {
  cronJobDataKecamatan = data;
};

export const setCronJobDataPerumahan = (data) => {
  cronJobDataPerumahan = data;
};
