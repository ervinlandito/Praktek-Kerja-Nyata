import { Sequelize } from "sequelize";

const db = new Sequelize("data_penduduk", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
