require("dotenv").config();
import * as redis from "redis";
const REDIS_DB_NUMBER: number =
  process.env.NODE_ENV === "test"
    ? Number(process.env.REDIS_DB_NUMBER_TEST || 0)
    : Number(process.env.REDIS_DB_NUMBER || 0);

const client = redis.createClient({
  url: "redis://localhost:6379",
  database: REDIS_DB_NUMBER,
});

client.on("error", err => console.log("Redis Client Error", err));

export default client;
