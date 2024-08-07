import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); 

console.log("DB IN DATABASE : ",process.env.DB_NAME)
console.log("DB IN DATABASE : ",process.env.DB_USERNAME)
console.log("DB IN DATABASE : ",process.env.DB_HOST)
console.log("DB IN DATABASE : ",process.env.DB_PASSWD)

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
});

export default db;
 