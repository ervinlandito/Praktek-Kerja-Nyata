import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import moment from "moment-timezone";
import StuntingData from "../model/stunting.js";

dotenv.config();

const getData = async () => {
  const tanggal = getFormattedDate();
  try {
    const response = await axios.get(`${process.env.URL_API5}`, {
      params: {
        tanggal: tanggal,
      },
    });

    if (!response || !response.data) {
      throw new Error("Failed to retrieve data");
    }
    logOperation({
      status: "success",
      timestamp: moment().tz("Asia/Jakarta").format(),
      details: `Successfully get stunting from ${process.env.URL_API5} for date ${tanggal}`,
    });

    return response.data;
  } catch (error) {
    logOperation({
      status: "error",
      timestamp: moment().tz("Asia/Jakarta").format(),
      details: `Failed to retrieve data: ${error.message}`,
    });
    throw error;
  }
};

export const postDataStunting = async () => {
  try {
    console.log("Memanggil getStuntingData pada jam 23:55 setiap hari");
    console.log("DB NAME:", process.env.DB_NAME);
    console.log("URL NAME:", process.env.URL_API5);

    const tanggal = getFormattedDate();
    let dataStunting = await getData();
    try {
      dataStunting = await axios.post(`${process.env.URL_API5}/stunting`, {
        tanggal: tanggal,
      });
    } catch (error) {}

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const directoryPath = path.join(__dirname, "..", "data");
    const stuntingFolder = path.join(directoryPath, "stunting");
    const fileName = `stunting-${tanggal}.json`;
    const filePath = path.join(stuntingFolder, fileName);

    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    if (!fs.existsSync(stuntingFolder)) {
      fs.mkdirSync(stuntingFolder, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(dataStunting.data, null, 2));

    const files = fs.readdirSync(stuntingFolder);
    if (files.length > 30) {
      const sortedFiles = files
        .map((file) => ({
          name: file,
          time: fs.statSync(path.join(stuntingFolder, file)).ctime.getTime(),
        }))
        .sort((a, b) => a.time - b.time);

      while (sortedFiles.length > 30) {
        const oldestFile = sortedFiles.shift();
        fs.unlinkSync(path.join(stuntingFolder, oldestFile.name));
      }
    }

    const data = dataStunting.data;

    try {
      for (const item of data) {
        await StuntingData.upsert(
          {
            row_id: item.row_id,
            NO: item.NO,
            PERIODE_TAHUN: item.PERIODE_TAHUN,
            NAMA_KECAMATAN: item.NAMA_KECAMATAN,
            NAMA_PUSKESMAS: item.NAMA_PUSKESMAS,
            ID_DESA_BPS: item.ID_DESA_BPS,
            ID_DESA_DAGRI: item.ID_DESA_DAGRI,
            NAMA_DESA: item.NAMA_DESA,
            JUMLAH_KELUARGA: item.JUMLAH_KELUARGA,
            JUMLAH_KELUARGA_BERESIKO_STUNTING:
              item.JUMLAH_KELUARGA_BERESIKO_STUNTING,
            JUMLAH_BALITA: item.JUMLAH_BALITA,
            JUMLAH_BALITA_SANGAT_PENDEK: item.JUMLAH_BALITA_SANGAT_PENDEK,
            JUMLAH_BALITA_PENDEK: item.JUMLAH_BALITA_PENDEK,
          },
          {
            where: {
              row_id: item.row_id,
            },
          }
        );
      }
      logOperation({
        status: "success",
        timestamp: moment().tz("Asia/Jakarta").format(),
        details: `StuntingData successfully retrieved and saved on db for date ${tanggal}`,
      });
    } catch (error) {
      logOperation({
        status: "error",
        timestamp: moment().tz("Asia/Jakarta").format(),
        details: `DB not connect ${error.message}`,
      });
    }
    return dataStunting.data;
  } catch (error) {
    console.error(error.message);
    logOperation({
      status: "error",
      timestamp: moment().tz("Asia/Jakarta").format(),
      details: `StuntingData cannot retrieved : ${error.message}`,
    });
  }
};

const getFormattedDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const logOperation = (logEntry) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const logDirectory = path.join(__dirname, "..", "logging");
  const currentDate = moment().tz("Asia/Jakarta").format("YYYY-MM-DD");
  const logFilePath = path.join(logDirectory, `history-${currentDate}.json`);

  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
  }

  let logs = [];

  if (fs.existsSync(logFilePath)) {
    try {
      const logData = fs.readFileSync(logFilePath, "utf8");
      if (logData) {
        logs = JSON.parse(logData);
      }
    } catch (error) {
      console.error("Error parsing log file:", error);
      logs = [];
    }
  }

  logs.push(logEntry);

  fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));

  const logFiles = fs.readdirSync(logDirectory);
  if (logFiles.length > 30) {
    const sortedLogFiles = logFiles
      .map((file) => ({
        name: file,
        time: fs.statSync(path.join(logDirectory, file)).ctime.getTime(),
      }))
      .sort((a, b) => a.time - b.time);

    while (sortedLogFiles.length > 30) {
      const oldestLogFile = sortedLogFiles.shift();
      fs.unlinkSync(path.join(logDirectory, oldestLogFile.name));
    }
  }
};
