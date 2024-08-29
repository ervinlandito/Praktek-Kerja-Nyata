import cron from "node-cron";
import DataKecamatan from "../model/dataModel.js";
import dotenv from "dotenv";
import DataPerumahan from "../model/dataPerumahan.js";
import { getDataRealisasi } from "../controllers/datakecamatan.js";
import { postDataPerumahan } from "../controllers/dataPerumahan.js";
import { postDataSiharkepo } from "../controllers/siharkepo.js";
import Siharkepo from "../model/siharkepo.js";
import Komoditi from "../model/komoditi.js";
import { postDatakomoditi } from "../controllers/komoditi.js";

let cronJobDataKecamatan = null;
let cronJobDataPerumahan = null;
let cronJobSiharkepo = null;
let cronJobKomoditi = null;
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

  if (cronJobSiharkepo) {
    try {
      await Siharkepo.create(cronJobSiharkepo);
      console.log(`Siharkepo successfully added into database`);
      cronJobSiharkepo = null;
      logOperation({
        status: "success",
        timestamp: moment().tz("Asia/Jakarta").format(),
        details: `Siharkepo successfully retrieved and saved for date${tanggal}`,
      });
    } catch (error) {
      console.error(`Cannot store Siharkepo into database`);
      logOperation({
        status: "error",
        timestamp: moment().tz("Asia/Jakarta").format(),
        details: `Siharkepo cannot retrieved`,
      });
    }
  }
  if (cronJobKomoditi) {
    try {
      await Komoditi.create(cronJobKomoditi);
      console.log(`Komoditi successfully added into database`);
      cronJobKomoditi = null;
      logOperation({
        status: "success",
        timestamp: moment().tz("Asia/Jakarta").format(),
        details: `Komoditi successfully retrieved and saved for date${tanggal}`,
      });
    } catch (error) {
      console.error(`Cannot store Komoditi into database`);
      logOperation({
        status: "error",
        timestamp: moment().tz("Asia/Jakarta").format(),
        details: `Komoditi cannot retrieved`,
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
      postDataSiharkepo();
      postDatakomoditi();
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

export const setCronJobDataSiharkepo = (data) => {
  cronJobSiharkepo = data;
};
