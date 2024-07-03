import express from "express";
import router from "../routes/data_routes";

const app = express();
const PORT = 5000;

app.use(router);

app.listen(PORT, () =>
  console.log(`Server berjalan di http://localhost:${port}`)
);
