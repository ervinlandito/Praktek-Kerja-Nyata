import DataKecamatan from "../model/dataModel.js";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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
    const tanggal = getFormattedDate();
    const dataRealiasi = await axios.post("https://esppt.id/simpbb/api/data-realisasi",{
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

    // console.log(dataRealiasi.data)
    // res.json(dataRealiasi.data);
    res.status(201).json({message: `Data Saved at ${filePath}`})
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
}

const getFormattedDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

