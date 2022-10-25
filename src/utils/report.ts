/* 
    this file include all reports logic. It acts as a service file.
*/
import { IResponse } from "../models/interfaces";
import client from "../config/redis";
import ping, { generateURL } from "./ping";
import { Report, ReportModel } from "../models/reportModel";
import mongoose from "mongoose";
import { Defaults, Schedules, Status } from "../models/enums";
import agenda from "../jobs/agenda";
import { CheckModel } from "../models/CheckModel";

export const converIntervalToMilliseconds = (interval: string): number => {
  const types = [
    { period: "seconds", val: 1000 },
    { period: "minutes", val: 60000 },
    { period: "hours", val: 3.6e6 },
    { period: "days", val: 8.64e7 },
    { period: "weeks", val: 6.048e8 },
    { period: "months", val: 2.628e9 },
  ];
  const type = interval.split(" ")[1];
  const value: number = Number(interval.split(" ")[0]);
  let intervalInMilliSeconds = 0;
  for (const t of types) {
    if (t.period == type) {
      intervalInMilliSeconds = t.val * value;
      break;
    }
  }
  return intervalInMilliSeconds;
};

export const getAvalability = (responses: IResponse[]): number => {
  if (responses.length > 0) {
    const numOfSuccessRes =
      responses?.reduce((total, _c) => {
        return _c.isSuccess ? (total += 1) : total;
      }, 0) || 0;
    const availability: number = (numOfSuccessRes / responses?.length!) * 100;

    return Number(availability.toFixed(2)) || 0;
  }
  return 0;
};

// I only add the time between two Consecutive success ping.
export const getUpTime = (responses: IResponse[], interval: string): number => {
  if (responses.length > 0) {
    const intervalInMilliSeconds = converIntervalToMilliseconds(interval);
    const totalUpTime = responses.reduce((total, current, idx): number => {
      if (idx && responses[idx - 1].isSuccess && current.isSuccess) {
        return (total += intervalInMilliSeconds);
      } else return total;
    }, 0);

    return totalUpTime;
  }
  return 0;
};

// I calculate the downtime with the worest case scenario in mind.
// I only exclude the time between two consecutive success ping.
export const getDownTime = (responses: IResponse[], interval: string): number => {
  if (responses.length > 0) {
    const intervalInMilliSeconds = converIntervalToMilliseconds(interval);
    const totalDownTime = responses.reduce((total, current, idx): number => {
      if (idx && (!responses[idx - 1] || !current.isSuccess)) {
        return (total += intervalInMilliSeconds);
      } else return total;
    }, 0);

    return totalDownTime;
  }
  return 0;
};

export const getCurrentStatus = async (checkId: string): Promise<Boolean> => {
  if (checkId.length) {
    try {
      const check = await CheckModel.findById(checkId);
      const URL = generateURL({
        url: check?.url!,
        protocol: check?.protocol!,
        port: check?.port!,
      });
      const response = await ping(URL);
      return response.isSuccess;
    } catch (error) {
      console.error(Defaults.MONGO_DB_ERROR, error);
    }
  }
  return false;
};

// return the average response time in milliseconds.
export const getAvgResponseTime = (responses: IResponse[]): number => {
  if (responses.length > 0) {
    let totalResTimeInMilSes = responses.reduce(
      (total, current): number => (total += current.resTime),
      0
    );

    const avgResponseTime = totalResTimeInMilSes / responses.length;
    return Number(avgResponseTime.toFixed(2));
  }
  return 0;
};

export const getHistory = (responses: IResponse[]): Date[] => {
  if (responses.length > 0) {
    return responses.map(res => res.Timestamped);
  }
  return [];
};

export const getOutages = (responses: IResponse[]): number => {
  if (responses.length > 0) {
    return responses.reduce(
      (total, current): number => (total += Number(!current.isSuccess && 1)),
      0
    );
  }
  return 0;
};

export const createReport = async (
  responses: IResponse[],
  key: string
): Promise<Report> => {
  const id = key.split(":")[1];
  const check = await CheckModel.findById(id);

  const currentStatus = await getCurrentStatus(id);
  const availability = getAvalability(responses || []);
  const avgResponseTime = getAvgResponseTime(responses || []);
  const history = getHistory(responses || []);
  const outages = getOutages(responses || []);
  const upTime = getUpTime(responses, check?.interval!);
  const downTime = getDownTime(responses, check?.interval!);

  return {
    downtime: downTime,
    uptime: upTime,
    outages,
    history,
    availability,
    responseTime: avgResponseTime,
    status: currentStatus ? Status.UP : Status.DOWN,
    checkId: new mongoose.Types.ObjectId(id),
  };
};

export const startReportSchedule = async () => {
  try {
    const reportJob = await agenda._collection.findOne({
      name: Schedules.REPORT_SCHEDULE,
    });
    if (!reportJob) {
      const scheduleAgenda = await agenda.create(Schedules.REPORT_SCHEDULE, {});
      await scheduleAgenda.repeatEvery(Defaults.REPORT_SCHEDULE_INTERVAL).save();
    }
  } catch (error) {
    console.error(Defaults.AGENDA_ERROR, error);
  }
};

export const getReportsSummurry = async (checkId: string): Promise<any> => {
  const res = await ReportModel.aggregate([
    {
      $match: {
        checkId: new mongoose.Types.ObjectId(checkId),
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: "$checkId",
        uptime: {
          $sum: "$uptime",
        },
        downtime: {
          $sum: "$downtime",
        },
        outages: {
          $sum: "$outages",
        },
        availability: {
          $avg: "$availability",
        },
        responseTime: {
          $avg: "$responseTime",
        },
      },
    },
  ]);
  console.log({ res });
  return res;
};
