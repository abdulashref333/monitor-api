require("dotenv").config();
import { connect } from "mongoose";
import { app, startServer } from "./server";
import mongoose from "mongoose";
import client from "./config/redis";
import { startReportSchedule } from "./utils/report";

startServer().then(() => {
  const PORT = process.env.PORT || 7000;
  const DB_HOST = process.env.DB_HOST;
  const DB_PORT = process.env.DB_PORT;

  client.connect(); // redis connection.

  connect(`mongodb://${DB_HOST}:${DB_PORT}/`, {
    dbName: process.env.DB_NAME,
  })
    .then(async () => {
      // update cron jobs to start automatically as scheduled.
      const collection = mongoose.connection.db.collection("jobs");
      await collection.updateMany({}, { $set: { lockedAt: null } });

      // start the report schedule..
      // await startReportSchedule();

      app.listen(PORT, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
      });
    })
    .catch(error => {
      console.log("Cannot open database connection:", error);
    });
});
