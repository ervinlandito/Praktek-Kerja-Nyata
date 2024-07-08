import DataKecamatan from "../model/dataModel.js";

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
    res
      .status(201)
      .json({ msg: "Data will be add to Database at 23.55 PM", data: newData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

