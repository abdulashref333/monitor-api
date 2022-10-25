import Agenda from "agenda";
import client from "../../config/redis";
import triggerEventEmitter from "../../events/checkAlert";
import { Schedules } from "../../models/enums";
import ping, { generateURL } from "../../utils/ping";

export const pingSchedule = (agenda: Agenda) => {
  agenda.define(
    Schedules.PING_SCHEDULE,
    { shouldSaveResult: true },
    async (job, done) => {
      const { url, protocol, port, _id, email, threshold, timeout }: any = job.attrs.data;

      const URI = generateURL({ protocol, url, port });
      const response = await ping(URI, timeout);
      console.log({ URI });
      // here I used a pattern to return all keys that related to checks.
      client
        .lPush(`check:${_id.toString()}`, JSON.stringify(response))
        .catch(err => console.log(err));

      if (!response.isSuccess) {
        triggerEventEmitter.emit("trigger", {
          email: email,
          url: URI,
          _id: _id,
          threshold: threshold,
        });
      }

      done();
    }
  );
};
