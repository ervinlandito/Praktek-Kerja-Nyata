import Sequelize from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const StuntingData = db.define(
  "stunting",
  {
    row_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    NO: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    PERIODE_TAHUN: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    NAMA_KECAMATAN: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    NAMA_PUSKESMAS: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ID_DESA_BPS: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ID_DESA_DAGRI: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    NAMA_DESA: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    JUMLAH_KELUARGA: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    JUMLAH_KELUARGA_BERESIKO_STUNTING: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    JUMLAH_BALITA: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    JUMLAH_BALITA_SANGAT_PENDEK: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    JUMLAH_BALITA_PENDEK: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default StuntingData;
