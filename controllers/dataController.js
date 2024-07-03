import DataKecamatan from "../model/dataModel";

export const getAllDataKecamatan = async (req, res) => {
  try {
    const dataKecamatan = await DataKecamatan.findAll();
    res.json(dataKecamatan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDataKecamatan = async (req, res) => {
  try {
    const newDataKecamatan = await DataKecamatan.create(req.body);
    res.status(201).json(newDataKecamatan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
