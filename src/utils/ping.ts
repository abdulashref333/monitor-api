import axios from "../config/axios";
import { IResponse } from "../models/interfaces";

export default async function ping(url: string, timeout?: number) {
  const response: IResponse = { resTime: 0, isSuccess: false };
  try {
    const res = await axios.get(url, { timeout: timeout || 5000 });
    response.resTime = res.data.duration;
    response.isSuccess = true;
  } catch (error: any) {
    response.resTime = error.duration;
  }

  return response;
}
