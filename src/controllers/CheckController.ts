import { validate } from "class-validator";
import { Request, Response } from "express";
import agenda from "../jobs/agenda";
import { CheckModel, Check } from "../models/CheckModel";
import { CustomResponse } from "../utils/custome-response";
import { ValidationError } from "../errors/validation-error";
import { CheckInput } from "../models/inputs/CheckInput";
import mongoose, { mongo } from "mongoose";
import { Schedules } from "../models/enums";

class CheckController {
  async getAllChecks(req: Request, res: Response, next: any) {
    try {
      const checks = await CheckModel.find({
        userId: new mongoose.Types.ObjectId(req.user?.id),
        isDeleted: false,
      }).sort({ createdAt: -1 });
      CustomResponse.send(res, checks);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
  async createCheck(req: Request, res: Response, next: any) {
    let check: CheckInput = new CheckInput();
    check.url = req.body.url;
    check.name = req.body.name;
    check.protocol = req.body.protocol;
    check.ignoreSSL = req.body.ignoreSSL;

    try {
      const errors = await validate(check);
      if (errors && errors.length > 0) throw new ValidationError("error.", errors);

      let newCheck = new CheckModel({
        ...check,
        email: req.user?.email,
        userId: new mongoose.Types.ObjectId(req.user?.id!),
        authentication: req.body.authentication,
        port: req.body.port,
        threshold: req.body.threshold,
        tags: req.body.tags,
        interval: req.body.interval,
      });

      const scheduleAgenda = agenda.create(Schedules.PING_SCHEDULE, newCheck);
      scheduleAgenda.repeatEvery(newCheck.interval!).save();
      const job = await agenda.jobs({ "data._id": newCheck._id });
      newCheck.jobId = job[0].attrs._id?.toString();

      newCheck = await newCheck.save();
      CustomResponse.send(res, newCheck);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
  async updateCheck(req: Request, res: Response, next: any) {
    const id = req.params.id;
    let check: CheckInput = new CheckInput();
    check.url = req.body.url;
    check.name = req.body.name;
    check.protocol = req.body.protocol;
    check.ignoreSSL = req.body.ignoreSSL;

    try {
      const updatedCheck = await CheckModel.findByIdAndUpdate(
        id,
        {
          ...check,
          email: req.user?.email!,
          authentication: req.body.authentication,
          port: req.body.port,
          threshold: req.body.threshold,
          tags: req.body.tags,
          interval: req.body.interval,
        },
        { new: true }
      );
      CustomResponse.send(res, updatedCheck);

      // update job >> remove the old job and create a new one.
      mongoose.connection.db
        .collection("jobs")
        .findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(updatedCheck?.jobId) },
          { $set: { data: updatedCheck } }
        )
        .catch(err => console.log("Agenda Error: ", err));
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
  async deleteCheck(req: Request, res: Response, next: any) {
    const id = req.params.id;
    try {
      const check = await CheckModel.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
      );
      CustomResponse.send(res, true);

      // remove the job(Cron process) from the db.
      mongoose.connection.db
        .collection("jobs")
        .findOneAndDelete({ _id: new mongoose.Types.ObjectId(check?.jobId) })
        .catch(err => console.log(err));
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}

export default new CheckController();
