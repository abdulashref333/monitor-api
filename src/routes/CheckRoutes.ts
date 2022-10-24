import express from "express";
import { auth } from "../middlewares/auth";
import CheckController from "../controllers/CheckController";

const checks = express.Router();

checks.use(auth);
checks
  .get("/", CheckController.getAllChecks)
  .post("/", CheckController.createCheck)
  .patch("/:id", CheckController.updateCheck)
  .delete("/:id", CheckController.deleteCheck);

export default checks;
