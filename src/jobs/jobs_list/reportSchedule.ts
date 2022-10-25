import Agenda from "agenda";
import { Schedules } from "../../models/enums";
import { flushDb, getAllRedisKeys, getValuesByKey } from "../../utils/redis";
import { IResponse } from "../../models/interfaces";
import { createReport } from "../../utils/report";
import { Report, ReportModel } from "../../models/reportModel";

export const reportSchedule = (agenda: Agenda) => {
  agenda.define(
    Schedules.REPORT_SCHEDULE,
    { shouldSaveResult: true },
    async (job, done) => {
      console.log("Report Scheduling Start...");
      const keys = await getAllRedisKeys();

      const reports: Report[] = [];

      if (keys && keys.length > 0) {
        await Promise.all(
          keys.map(async key => {
            let keys = await getValuesByKey(key);
            const responses: IResponse[] | undefined = keys?.map(
              (res): IResponse => JSON.parse(res)
            );

            const report: Report = await createReport(responses || [], key);
            reports.push(report);
          }) || []
        );

        await ReportModel.insertMany(reports);
        flushDb();
      }

      done();
    }
  );
};
