import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const DataKecamatan = db.define(
  "data_kecamatan",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    kecamatan: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    jumlah_objek: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    baku: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    pokok: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    denda: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    realisasi: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    persentase_realisasi: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

// (async () => {
//   await db.sync({ alter: true });
// })();

export default DataKecamatan;
