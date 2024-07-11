import DataKecamatan from "../model/dataModel.js";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import moment from 'moment-timezone';

dotenv.config(); // Load environment variables from .env file

export const getAllDataKecamatan = async (req, res) => {
  try {
    const dataKecamatan = await DataKecamatan.findAll({
      attributes: [
        "kecamatan",
        "jumlah_objek",
        "baku",
        "pokok",
        "denda",
        "realisasi",
        "persentase_realisasi",
      ],
    });
    res.json({
      isFalse: false,
      data: dataKecamatan,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDataKecamatan = async (req, res) => {
  const {
    kecamatan,
    jumlah_objek,
    baku,
    pokok,
    denda,
    realisasi,
    persentase_realisasi,
  } = req.body;
  const newData = {
    kecamatan,
    jumlah_objek,
    baku,
    pokok,
    denda,
    realisasi,
    persentase_realisasi,
  };
  try {
    setCronJobData(newData);
    res.status(201).json({ msg: "Data will be add to Database at 23.55 PM", data: newData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDataRealisasi = async (req, res) =>{
  try {
    console.log('Memanggil getDataRealisasi pada jam 23:55 setiap hari');
    console.log("DB NAME:", process.env.DB_NAME);
    console.log("URL NAME:", process.env.URL_API);
    const tanggal = getFormattedDate();
    const dataRealiasi = await axios.post(`${process.env.URL_API}/data-realisasi`,{
      tanggal : tanggal
    })

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const directoryPath = path.join(__dirname, '..', 'data');
    const fileName = `data-realisasi-${tanggal}.json`;
    const filePath = path.join(directoryPath, fileName);

    // Ensure the directory exists
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    // Save the response to a file
    fs.writeFileSync(filePath, JSON.stringify(dataRealiasi.data, null, 2));

    const data = dataRealiasi.data.data;
    for (const item of data) {
      await DataKecamatan.upsert({
        kecamatan: item.kecamatan,
        jumlah_objek: item.jumlah_objek,
        baku: item.baku,
        pokok: item.pokok,
        denda: item.denda,
        realisasi: item.realisasi,
        persentase_realisasi: item.persentase_realisasi,
      }, {
        where: {
          kecamatan: item.kecamatan 
        }
      });
    }
    logOperation({
      status: 'success',
      timestamp: moment().tz('Asia/Jakarta').format(),
      details: `Data successfully retrieved and saved for date ${tanggal}`
    });

    return dataRealiasi.data;
  } catch (error) {
    console.error(error);
    logOperation({
      status: 'error',
      timestamp: moment().tz('Asia/Jakarta').format(),
      details: error.message
    });
  }
}

const getFormattedDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const logOperation = (logEntry) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const logDirectory = path.join(__dirname, '..', 'logging');
  const logFilePath = path.join(logDirectory, 'log.json');

  // Ensure the logging directory exists
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
  }

  let logs = [];

  // Read existing logs if the log file exists and is not empty
  if (fs.existsSync(logFilePath)) {
    try {
      const logData = fs.readFileSync(logFilePath, 'utf8');
      if (logData) {
        logs = JSON.parse(logData);
      }
    } catch (error) {
      console.error('Error parsing log file:', error);
      // If there's an error, we'll start with an empty log array
      logs = [];
    }
  }

  // Append new log entry
  logs.push(logEntry);

  // Write updated logs to file
  fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));
};