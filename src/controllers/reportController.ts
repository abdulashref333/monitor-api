import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors/bad-request-error";
import { CheckModel } from "../models/CheckModel";
import { ReportModel } from "../models/reportModel";
import { CustomResponse } from "../utils/custome-response";

class ReportController {
  async getReportsForCheck(req: Request, res: Response, next: NextFunction) {
    const checkId = req.params.id;
    try {
      const check = await CheckModel.findById(checkId);
      if (!check) {
        throw new BadRequestError("No checks found.");
      }

      // get the last created report.
      const report = await ReportModel.find({ checkId }).sort({ createdAt: -1 }).limit(1);

      CustomResponse.send(res, report, "success.");
    } catch (error) {
      next(error);
    }
  }

  async getReportsByTags(req: Request, res: Response, next: any) {
    try {
    } catch (error) {}
  }

  async deleteReports(req: Request, res: Response, next: any) {
    try {
    } catch (error) {
      next(error);
    }
  }
}

export default new ReportController();
