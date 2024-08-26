import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import moment from "moment-timezone";
import DataPerumahan from "../model/dataPerumahan.js";
import { verifyToken } from "../middleware/verifyToken.js";

dotenv.config();

const getData = async () => {
  const token = await verifyToken();
  const tanggal = getFormattedDate();
  try {
    const response = await axios.get(`${process.env.URL_API2}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        tanggal: tanggal,
      },
    });

    if (!response || !response.data) {
      throw new Error("Failed to retrieve data");
    }

    // Memastikan data sesuai dengan format respons yang diharapkan
    const { status, message, data } = response.data;
    if (status !== true) {
      throw new Error(message || "Failed to retrieve data");
    }
    logOperation({
      status: "success",
      timestamp: moment().tz("Asia/Jakarta").format(),
      details: `Successfully get dataPerumahan from ${process.env.URL_API2} for date ${tanggal}`,
    });

    return { status, message, data };
  } catch (error) {
    logOperation({
      status: "error",
      timestamp: moment().tz("Asia/Jakarta").format(),
      details: `Failed to retrieve data: ${error.message}`,
    });
    throw error;
  }
};

export const postDataPerumahan = async () => {
  try {
    console.log("Memanggil getDataPerumahan pada jam 23:55 setiap hari");
    console.log("DB NAME:", process.env.DB_NAME);
    console.log("URL NAME:", process.env.URL_API2);

    const tanggal = getFormattedDate();
    // const token = await verifyToken();
    let dataPerumahan = await getData();
    try {
      dataPerumahan = await axios.post(
        `${process.env.URL_API2}/data-perumahan`,
        {
          tanggal: tanggal,
        }
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      );
    } catch (error) {}

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const directoryPath = path.join(__dirname, "..", "data");
    const perumahanFolder = path.join(directoryPath, "perumahan");
    const fileName = `data-perumahan-${tanggal}.json`;
    const filePath = path.join(perumahanFolder, fileName);

    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    if (!fs.existsSync(perumahanFolder)) {
      fs.mkdirSync(perumahanFolder, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(dataPerumahan.data, null, 2));

    const files = fs.readdirSync(perumahanFolder);
    if (files.length > 30) {
      const sortedFiles = files
        .map((file) => ({
          name: file,
          time: fs.statSync(path.join(perumahanFolder, file)).ctime.getTime(),
        }))
        .sort((a, b) => a.time - b.time);

      while (sortedFiles.length > 30) {
        const oldestFile = sortedFiles.shift();
        fs.unlinkSync(path.join(perumahanFolder, oldestFile.name));
      }
    }

    const data = dataPerumahan.data;

    if (!Array.isArray(data)) {
      throw new Error("Data is not iterable");
    }

    try {
      for (const item of data) {
        await DataPerumahan.upsert(
          {
            id_perumahan: item.id_perumahan,
            id_pengembang: item.id_pengembang,
            id_user: item.id_user,
            id_kecamatan: item.id_kecamatan,
            id_desa: item.id_desa,
            perumahan: item.perumahan,
            alamat_perumahan: item.alamat_perumahan,
            izin: item.izin,
            telepon: item.telepon,
            tahun_berdiri: item.tahun_berdiri,
            koordinat_x: item.koordinat_x,
            koordinat_y: item.koordinat_y,
            zoom_peta: item.zoom_peta,
            gambar: item.gambar,
            nama_penanggung_jawab: item.nama_penanggung_jawab,
            telp_penanggung_jawab: item.telp_penanggung_jawab,
            luas_peng_1: item.luas_peng_1,
            luas_peng_2: item.luas_peng_2,
            luas_lahan_terbangun: item.luas_lahan_terbangun,
            unit_rumah_rencana: item.unit_rumah_rencana,
            unit_rumah_terbangun: item.unit_rumah_terbangun,
            luas_jalan_rencana: item.luas_jalan_rencana,
            luas_jalan_eksisting: item.luas_jalan_eksisting,
            luas_rth_rencana: item.luas_rth_rencana,
            luas_rth_eksisting: item.luas_rth_eksisting,
            luas_makam_rencana: item.luas_makam_rencana,
            luas_makam_eksisting: item.luas_makam_eksisting,
            luas_sarana_lain_rencana: item.luas_sarana_lain_rencana,
            luas_sarana_lain_eksisting: item.luas_sarana_lain_eksisting,
            jaringan_air_rencana: item.jaringan_air_rencana,
            jaringan_air_eksisting: item.jaringan_air_eksisting,
            peta_perumahan: item.peta_perumahan,
            peta_persil: item.peta_persil,
            geojson_batas_perumahan: item.geojson_batas_perumahan,
            geojson_batas_text: item.geojson_batas_text,
            geojson_persil_eksisting: item.geojson_persil_eksisting,
            geojson_persil_rencana: item.geojson_persil_rencana,
            psu_eksisting: item.psu_eksisting,
            psu_rencana: item.psu_rencana,
            created_at: item.created_at,
            updated_at: item.updated_at,
            jml_mbr_rcn: item.jml_mbr_rcn,
            jml_mbr_eks: item.jml_mbr_eks,
            jml_nonmbr_rcn: item.jml_nonmbr_rcn,
            jml_nonmbr_eks: item.jml_nonmbr_eks,
            jml_rmh_umum: item.jml_rmh_umum,
            jml_rmh_komersial: item.jml_rmh_komersial,
          },
          {
            where: {
              id_perumahan: item.id_perumahan,
            },
          }
        );
      }
      logOperation({
        status: "success",
        timestamp: moment().tz("Asia/Jakarta").format(),
        details: `Data Perumahan successfully retrieved and saved on db for date ${tanggal}`,
      });
    } catch (error) {
      logOperation({
        status: "error",
        timestamp: moment().tz("Asia/Jakarta").format(),
        details: `DB not connect ${error.message}`,
      });
    }
    return dataPerumahan.data;
  } catch (error) {
    console.error(error.message);
    logOperation({
      status: "error",
      timestamp: moment().tz("Asia/Jakarta").format(),
      details: `Data Perumahan cannot retrieved : ${error.message}`,
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
