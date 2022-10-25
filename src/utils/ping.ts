import axios from "../config/axios";
import { Defaults, Protocols } from "../models/enums";
import { IResponse } from "../models/interfaces";

export default async function ping(url: string, timeout?: number) {
  const response: IResponse = { resTime: 0, isSuccess: false, Timestamped: new Date() };
  try {
    const res = await axios.get(url, { timeout: timeout || Defaults.TIMEOUT });
    response.resTime = res.data.duration;
    response.isSuccess = true;
    response.Timestamped = new Date();
  } catch (error: any) {
    response.resTime = error.duration;
    response.Timestamped = new Date();
  }

  return response;
}

export const generateURL = (options: {
  protocol: string;
  url: string;
  port: number;
}): string => {
  const { protocol, url, port } = options;
  const URL = `${protocol}://${url}${port ? ":" + port : ""}/`;
  return URL;
};
