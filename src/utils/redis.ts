import client from "../config/redis";
import { Defaults } from "../models/enums";

export const getAllRedisKeys = async () => {
  try {
    return await await client.keys("check:*");
  } catch (error) {
    console.error("Redis Error: ", error);
  }
};

export const getValuesByKey = async (key: string) => {
  try {
    return await client.lRange(key, 0, -1);
  } catch (error) {
    console.error("Redis Error: ", error);
  }
};

export const flushDb = async () => {
  try {
    await client.flushDb();
  } catch (error) {
    console.error(Defaults.REDIS_DB_ERROR, error);
  }
};
