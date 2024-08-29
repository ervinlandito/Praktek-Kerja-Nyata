import DataKecamatan from "../model/dataModel.js";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import moment from "moment-timezone";

dotenv.config();

export const getDataRealisasi = async (req, res) => {
  try {
    console.log("Memanggil getDataRealisasi pada jam 23:55 setiap hari");
    console.log("DB NAME:", process.env.DB_NAME);
    console.log("URL NAME:", process.env.URL_API);
    const tanggal = getFormattedDate();
    let dataRealiasi;
    try {
      dataRealiasi = await axios.post(`${process.env.URL_API}/data-realisasi`, {
        tanggal: tanggal,
      });
      logOperation({
        status: "success",
        timestamp: moment().tz("Asia/Jakarta").format(),
        details: `Successfully get dataKecamatan from ${process.env.URL_API} for date ${tanggal}`,
      });
    } catch (error) {
      logOperation({
        status: "get error",
        timestamp: moment().tz("Asia/Jakarta").format(),
        details: `Failed get dataKecamatan from ${process.env.URL_API} for date ${tanggal}`,
      });
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const directoryPath = path.join(__dirname, "..", "data");
    const kecamatanFolder = path.join(directoryPath, "kecamatan");
    const fileName = `data-realisasi-${tanggal}.json`;
    const filePath = path.join(kecamatanFolder, fileName);

    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    if (!fs.existsSync(kecamatanFolder)) {
      fs.mkdirSync(kecamatanFolder, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(dataRealiasi.data, null, 2));

    const files = fs.readdirSync(kecamatanFolder);
    if (files.length > 30) {
      const sortedFiles = files
        .map((file) => ({
          name: file,
          time: fs.statSync(path.join(kecamatanFolder, file)).ctime.getTime(),
        }))
        .sort((a, b) => a.time - b.time);

      while (sortedFiles.length > 30) {
        const oldestFile = sortedFiles.shift();
        fs.unlinkSync(path.join(kecamatanFolder, oldestFile.name));
      }
    }

    const data = dataRealiasi.data.data;

    try {
      for (const item of data) {
        await DataKecamatan.upsert(
          {
            kecamatan: item.kecamatan,
            jumlah_objek: item.jumlah_objek,
            baku: item.baku,
            pokok: item.pokok,
            denda: item.denda,
            realisasi: item.realisasi,
            persentase_realisasi: item.persentase_realisasi,
          },
          {
            where: {
              kecamatan: item.kecamatan,
            },
          }
        );
      }

      logOperation({
        status: "success",
        timestamp: moment().tz("Asia/Jakarta").format(),
        details: `DataKecamatan successfully retrieved and saved on db for date ${tanggal}`,
      });
    } catch (error) {
      logOperation({
        status: "error",
        timestamp: moment().tz("Asia/Jakarta").format(),
        details: `DB not connect ${error.message}`,
      });
    }

    return dataRealiasi.data;
  } catch (error) {
    console.error(error.message);
    logOperation({
      status: "error",
      timestamp: moment().tz("Asia/Jakarta").format(),
      details: `DataKecamatan cannot retrieved : ${error.message}`,
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
