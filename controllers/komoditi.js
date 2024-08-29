import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import moment from "moment-timezone";
import Komoditi from "../model/komoditi.js";

dotenv.config();

const getData = async () => {
  const tanggal = getFormattedDate();
  try {
    const response = await axios.get(`${process.env.URL_API4}`, {
      headers: {
        "X-API-KEY": process.env.X_API_KEY,
        Authorization: `Basic ${Buffer.from(process.env.SECRET_USER).toString(
          "base64"
        )}`,
      },
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
      details: `Successfully get Komoditi from ${process.env.URL_API4} for date ${tanggal}`,
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

export const postDatakomoditi = async () => {
  try {
    console.log("Memanggil getDataKomoditi pada jam 23:55 setiap hari");
    console.log("DB NAME:", process.env.DB_NAME);
    console.log("URL NAME:", process.env.URL_API4);

    const tanggal = getFormattedDate();
    let komoditi = await getData();
    try {
      komoditi = await axios.post(
        `${process.env.URL_API4}/komoditi`,
        {
          tanggal: tanggal,
        },
        {
          headers: {
            "X-API-KEY": process.env.X_API_KEY,
            Authorization: `Basic ${Buffer.from(
              process.env.SECRET_USER
            ).toString("base64")}`,
          },
        }
      );
    } catch (error) {}

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const directoryPath = path.join(__dirname, "..", "data");
    const komoditiFolder = path.join(directoryPath, "komoditi");
    const fileName = `komoditi-${tanggal}.json`;
    const filePath = path.join(komoditiFolder, fileName);

    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    if (!fs.existsSync(komoditiFolder)) {
      fs.mkdirSync(komoditiFolder, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(komoditi.data, null, 2));

    const files = fs.readdirSync(komoditiFolder);
    if (files.length > 30) {
      const sortedFiles = files
        .map((file) => ({
          name: file,
          time: fs.statSync(path.join(komoditiFolder, file)).ctime.getTime(),
        }))
        .sort((a, b) => a.time - b.time);

      while (sortedFiles.length > 30) {
        const oldestFile = sortedFiles.shift();
        fs.unlinkSync(path.join(komoditiFolder, oldestFile.name));
      }
    }

    const data = komoditi.data;

    if (!Array.isArray(data)) {
      throw new Error("Data is not iterable");
    }

    try {
      for (const item of data) {
        await Komoditi.upsert(
          {
            id_harga: item.id_harga,
            nama_komoditi: item.nama_komoditi,
            daerah: item.daerah,
            harga_per_kg: item.harga_per_kg,
            harga_baru: item.harga_baru,
            created_at: item.created_at,
            created_by: item.created_by,
            updated_at: item.updated_at,
            updated_by: item.updated_by,
            deleted_at: item.deleted_at,
            deleted_by: item.deleted_by,
            uuid: item.uuid,
            lock: item.lock,
          },
          {
            where: {
              id_harga: item.id_harga,
            },
          }
        );
      }
      logOperation({
        status: "success",
        timestamp: moment().tz("Asia/Jakarta").format(),
        details: `Data Komoditi successfully retrieved and saved on db for date ${tanggal}`,
      });
    } catch (error) {
      logOperation({
        status: "error",
        timestamp: moment().tz("Asia/Jakarta").format(),
        details: `DB not connect ${error.message}`,
      });
    }
    return komoditi.data;
  } catch (error) {
    console.error(error.message);
    logOperation({
      status: "error",
      timestamp: moment().tz("Asia/Jakarta").format(),
      details: `Data Komoditi cannot retrieved : ${error.message}`,
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
