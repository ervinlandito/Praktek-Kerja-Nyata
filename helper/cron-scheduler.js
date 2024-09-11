import cron from "node-cron";
import DataKecamatan from "../model/dataModel.js";
import dotenv from "dotenv";
import DataPerumahan from "../model/dataPerumahan.js";
import Siharkepo from "../model/siharkepo.js";
import Komoditi from "../model/komoditi.js";
import { getDataRealisasi } from "../controllers/datakecamatan.js";
import { postDataPerumahan } from "../controllers/dataPerumahan.js";
import { postDataSiharkepo } from "../controllers/siharkepo.js";
import { postDatakomoditi } from "../controllers/komoditi.js";
import { postDataStunting } from "../controllers/stunting.js";

let cronJobDataKecamatan = null;
let cronJobDataPerumahan = null;
let cronJobSiharkepo = null;
let cronJobKomoditi = null;
let cronJobStunting = null;
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

  if (cronJobStunting) {
    try {
      await Komoditi.create(cronJobStunting);
      console.log(`Stunting successfully added into database`);
      cronJobStunting = null;
      logOperation({
        status: "success",
        timestamp: moment().tz("Asia/Jakarta").format(),
        details: `Stunting successfully retrieved and saved for date${tanggal}`,
      });
    } catch (error) {
      console.error(`Cannot store Stunting into database`);
      logOperation({
        status: "error",
        timestamp: moment().tz("Asia/Jakarta").format(),
        details: `Stunting cannot retrieved`,
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
      postDataStunting();
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

export const setCronJobDataKomoditi = (data) => {
  cronJobSiharkepo = data;
};

export const setCronJobDataStunting = (data) => {
  cronJobSiharkepo = data;
};
