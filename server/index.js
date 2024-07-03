import express from "express";
import bodyParser from "body-parser";
import router from "../routes/data_routes.js";

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(router);

app.listen(PORT, () =>
  console.log(`Server berjalan di http://localhost:${PORT}`)
);
