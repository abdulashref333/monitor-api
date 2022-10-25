import agenda from "../config/agenda";
import { pingSchedule } from "./jobs_list/pingSchedule";
import { reportSchedule } from "./jobs_list/reportSchedule";

let jobTypes = [pingSchedule, reportSchedule];

jobTypes.forEach(schedules => {
  schedules(agenda);
});

if (jobTypes.length) {
  // if there are jobs in the jobsTypes array set up
  agenda.on("ready", async () => await agenda.start());
}

export default agenda;
