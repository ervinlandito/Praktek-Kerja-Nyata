import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import moment from "moment-timezone";
import Siharkepo from "../model/siharkepo.js";

dotenv.config();

const getData = async () => {
  const tanggal = getFormattedDate();
  try {
    const response = await axios.get(`${process.env.URL_API3}`, {
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
      details: `Successfully get siharkepo from ${process.env.URL_API3} for date ${tanggal}`,
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

export const postDataSiharkepo = async () => {
  try {
    console.log("Memanggil getDataPerumahan pada jam 23:55 setiap hari");
    console.log("DB NAME:", process.env.DB_NAME);
    console.log("URL NAME:", process.env.URL_API3);

    const tanggal = getFormattedDate();
    let dataSiharkepo = await getData();
    try {
      dataSiharkepo = await axios.post(`${process.env.URL_API3}/siharkepo`, {
        tanggal: tanggal,
      });
    } catch (error) {}

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const directoryPath = path.join(__dirname, "..", "data");
    const siharkepoFolder = path.join(directoryPath, "siharkepo");
    const fileName = `siharkepo-${tanggal}.json`;
    const filePath = path.join(siharkepoFolder, fileName);

    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    if (!fs.existsSync(siharkepoFolder)) {
      fs.mkdirSync(siharkepoFolder, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(dataSiharkepo.data, null, 2));

    const files = fs.readdirSync(siharkepoFolder);
    if (files.length > 30) {
      const sortedFiles = files
        .map((file) => ({
          name: file,
          time: fs.statSync(path.join(siharkepoFolder, file)).ctime.getTime(),
        }))
        .sort((a, b) => a.time - b.time);

      while (sortedFiles.length > 30) {
        const oldestFile = sortedFiles.shift();
        fs.unlinkSync(path.join(siharkepoFolder, oldestFile.name));
      }
    }

    const data = dataSiharkepo.data;

    try {
      for (const item of data) {
        await Siharkepo.upsert(
          {
            IdKomoditi: item.IdKomoditi,
            NamaKomoditi: item.NamaKomoditi,
            Harga_aft: item.Harga_aft,
            Harga_bef: item.Harga_bef,
            perubahan_harga: item.perubahan_harga,
            Satuan: item.Satuan,
            Tanggal: item.Tanggal,
            status_perubahan: item.status_perubahan,
            gambar: item.gambar,
          },
          {
            where: {
              IdKomoditi: item.IdKomoditi,
            },
          }
        );
      }
      logOperation({
        status: "success",
        timestamp: moment().tz("Asia/Jakarta").format(),
        details: `Siharkepo successfully retrieved and saved on db for date ${tanggal}`,
      });
    } catch (error) {
      logOperation({
        status: "error",
        timestamp: moment().tz("Asia/Jakarta").format(),
        details: `DB not connect ${error.message}`,
      });
    }
    return dataSiharkepo.data;
  } catch (error) {
    console.error(error.message);
    logOperation({
      status: "error",
      timestamp: moment().tz("Asia/Jakarta").format(),
      details: `Siharkepo cannot retrieved : ${error.message}`,
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
