import EventEmitter from "events";
import client from "../config/redis";
import alertEventEmitter from "./alert";

const triggerEventEmitter = new EventEmitter();

triggerEventEmitter.on("trigger", (data: any) => {
  setTimeout(async () => {
    try {
      let responses = await client.lRange(data._id.toString(), 0, -1);
      responses = responses.map(res => JSON.parse(res));

      let countFaults = 0;
      responses.forEach((res: any) => {
        countFaults += !res.isSuccess ? 1 : 0; // count the down times.
      });

      if (countFaults >= data.threshold) {
        alertEventEmitter.emit("alert", { email: data.email, url: data.url });
      }
    } catch (error) {
      console.log("Trigger Error.", error);
    }
  }, 0);
});
export default triggerEventEmitter;
