import express from "express";
import { auth } from "../middlewares/auth";
import ReportController from "../controllers/reportController";

const reports = express.Router();

reports.use(auth);
reports
  .get("/checks/:id", ReportController.getReportsForCheck)
  .delete("/:id", ReportController.deleteReports);

export default reports;
