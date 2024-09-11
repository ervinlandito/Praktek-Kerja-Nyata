import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const DataPerumahan = db.define(
  "data_perumahan",
  {
    id_perumahan: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_pengembang: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_kecamatan: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_desa: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    perumahan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alamat_perumahan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    izin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    telepon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tahun_berdiri: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    koordinat_x: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    koordinat_y: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    zoom_peta: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    gambar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nama_penanggung_jawab: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    telp_penanggung_jawab: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    luas_peng_1: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    luas_peng_2: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    luas_lahan_terbangun: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    unit_rumah_rencana: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    unit_rumah_terbangun: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    luas_jalan_rencana: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    luas_jalan_eksisting: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    luas_rth_rencana: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    luas_rth_eksisting: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    luas_makam_rencana: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    luas_makam_eksisting: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    luas_sarana_lain_rencana: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    luas_sarana_lain_eksisting: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    jaringan_air_rencana: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    jaringan_air_eksisting: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    peta_perumahan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    peta_persil: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    geojson_batas_perumahan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    geojson_batas_text: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    geojson_persil_eksisting: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    geojson_persil_rencana: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    psu_eksisting: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    psu_rencana: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    jml_mbr_rcn: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    jml_mbr_eks: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    jml_nonmbr_rcn: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    jml_nonmbr_eks: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    jml_rmh_umum: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    jml_rmh_komersial: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

// (async () => {
//   await db.sync({ alter: true });
// })();

export default DataPerumahan;
