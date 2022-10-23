import Agenda from "agenda";
import check from "../../utils/check";

module.exports = (agenda: Agenda) => {
  agenda.define("Check Scheduling", { shouldSaveResult: true }, async (job, done) => {
    // console.log("time: ", new Date().toLocaleTimeString());
    const { url, protocol, port, timeout }: any = job.attrs.data;

    const URI = `${protocol}://${url}${port ? ":" + port : ""}/`;
    // console.log({ URI });
    check(URI, job.attrs);
    done();
  });
};
