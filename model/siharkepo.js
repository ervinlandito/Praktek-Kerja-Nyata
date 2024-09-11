import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Siharkepo = db.define(
  "siharkepo",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    IdKomoditi: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    NamaKomoditi: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    Harga_aft: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    Harga_bef: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    perubahan_harga: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    Satuan: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    Tanggal: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status_perubahan: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    gambar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Siharkepo;
