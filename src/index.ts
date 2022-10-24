require("dotenv").config();
import { connect } from "mongoose";
import { app, startServer } from "./server";
import mongoose from "mongoose";
import client from "./config/redis";

startServer().then(() => {
  const PORT = process.env.PORT || 7000;
  const DB_HOST = process.env.DB_HOST;
  const DB_PORT = process.env.DB_PORT;

  client.connect();
  connect(`mongodb://${DB_HOST}:${DB_PORT}/`, {
    dbName: process.env.DB_NAME,
  })
    .then(async () => {
      const collection = mongoose.connection.db.collection("jobs");
      await collection.updateMany({}, { $set: { lockedAt: null } });

      app.listen(PORT, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
      });
    })
    .catch(error => {
      console.log("Cannot open database connection:", error);
    });
});
