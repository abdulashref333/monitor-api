import { getModelForClass, ReturnModelType } from "@typegoose/typegoose";
import { validate } from "class-validator";
import { Request, Response } from "express";
import { BadRequestError } from "../errors/bad-request-error";
import agenda from "../jobs/agenda";
import { CheckModel, Check } from "../models/CheckModel";
import { CustomResponse } from "../utils/custome-response";
import { validateOrRejectInp } from "../utils/validate";
import { ValidationError } from "../errors/validation-error";
import { CheckInput } from "../models/inputs/CheckInput";
// import global from "../env";

class CheckController {
  async getAllChecks(req: Request, res: Response, next: any) {}
  async createCheck(req: Request, res: Response, next: any) {
    let check: CheckInput = new CheckInput();
    check.url = req.body.url;
    check.name = req.body.name;
    check.protocol = req.body.protocol;
    check.ignoreSSL = req.body.ignoreSSL;

    try {
      const errors = await validate(check);
      if (errors && errors.length > 0) throw new ValidationError("error.", errors);
      const creatCheck: Check = {
        ...check,
        email: req.user?.email!,
        authentication: req.body.authentication,
        port: req.body.port,
        threshold: req.body.threshold,
        tags: req.body.tags,
        interval: req.body.interval,
      };
      const newCheck = await CheckModel.create(creatCheck);
      if (newCheck !== null) {
        const scheduleAgenda = agenda.create("Check Scheduling", newCheck);
        scheduleAgenda.repeatEvery(newCheck.interval!).save();
      }

      CustomResponse.send(res, newCheck);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
  async updateCheck(req: Request, res: Response, next: any) {}
  async deleteCheck(req: Request, res: Response, next: any) {}
}

export default new CheckController();
