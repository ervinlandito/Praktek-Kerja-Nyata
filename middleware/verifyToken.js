import axios from "axios";
import dotenv from "dotenv";
import moment from "moment-timezone";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";

dotenv.config();

const logOperation = (logEntry) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const logDirectory = path.join(__dirname, "..", "logging");
  const currentDate = moment().tz("Asia/Jakarta").format("YYYY-MM-DD");
  const logFilePath = path.join(logDirectory, `history-${currentDate}.json`);

  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
  }

  let logs = [];

  if (fs.existsSync(logFilePath)) {
    try {
      const logData = fs.readFileSync(logFilePath, "utf8");
      if (logData) {
        logs = JSON.parse(logData);
      }
    } catch (error) {
      console.error("Error parsing log file:", error);
      logs = [];
    }
  }

  logs.push(logEntry);

  fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));

  const logFiles = fs.readdirSync(logDirectory);
  if (logFiles.length > 30) {
    const sortedLogFiles = logFiles
      .map((file) => ({
        name: file,
        time: fs.statSync(path.join(logDirectory, file)).ctime.getTime(),
      }))
      .sort((a, b) => a.time - b.time);

    while (sortedLogFiles.length > 30) {
      const oldestLogFile = sortedLogFiles.shift();
      fs.unlinkSync(path.join(logDirectory, oldestLogFile.name));
    }
  }
};

export const verifyToken = async () => {
  try {
    const response = await axios.post(process.env.SECRET_LOGIN, {
      email: process.env.SECRET_EMAIL,
      password: process.env.SECRET_PASSWORD,
    });

    if (response.status === 200 && response.data.token) {
      logOperation({
        status: "success",
        timestamp: moment().tz("Asia/Jakarta").format(),
        details: `Successfully obtained token`,
      });
      return response.data.token;
    } else {
      throw new Error("Invalid response or no token");
    }
  } catch (error) {
    console.error(
      "Error during login:",
      error.response ? error.response.data : error.message
    );
    logOperation({
      status: "error",
      timestamp: moment().tz("Asia/Jakarta").format(),
      details: `Error get Token : ${error.message}`,
    });
    throw new Error("Login failed");
  }
};
