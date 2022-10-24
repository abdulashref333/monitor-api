import Agenda from "agenda";
import client from "../../config/redis";
import triggerEventEmitter from "../../events/checkAlert";
import ping from "../../utils/ping";

module.exports = (agenda: Agenda) => {
  agenda.define("Ping Scheduling", { shouldSaveResult: true }, async (job, done) => {
    const { url, protocol, port, _id, email, threshold, timeout }: any = job.attrs.data;

    const URI = `${protocol}://${url}${port ? ":" + port : ""}/`;
    // console.log({ URI });
    const response = await ping(URI, timeout);

    client.lPush(_id.toString(), JSON.stringify(response)).catch(err => console.log(err));

    if (!response.isSuccess) {
      triggerEventEmitter.emit("trigger", {
        email: email,
        url: URI,
        _id: _id,
        threshold: threshold,
      });
    }

    done();
  });
};
