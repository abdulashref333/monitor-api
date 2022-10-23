import axios from "../config/axios";
import triggerEventEmitter from "../events/checkAlert";
import client from "../config/redis"; // client is obj to connect to redis db.
import { IResponse } from "../models/interfaces";

export default async function check(url: string, attr: any) {
  const { data } = attr;
  const response: IResponse = { resTime: 0, isSuccess: false };
  let res;
  try {
    res = await axios.get(url, { timeout: data.timeout });
    response.resTime = 22;
    response.isSuccess = true;

    // here I save the response into redis as an element in an array.
    client
      .lPush(data._id.toString(), JSON.stringify(response))
      .catch(err => console.log(err));

    // client.rPop(data._id.toString()).then(r => console.log(JSON.parse(r || "")))
  } catch (error: any) {
    response.resTime = error.duration;

    client
      .lPush(data._id.toString(), JSON.stringify(response))
      .catch(err => console.log(err));

    // here if the server down.
    triggerEventEmitter.emit("trigger", {
      email: data.email,
      url,
      _id: data._id,
      threshold: data.threshold,
    });
    console.error(`Check URL Alert: ${url} `);
  }
}
