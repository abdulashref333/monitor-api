require("dotenv").config();
import { json } from "body-parser";
import cors from "cors";
import express, { Response } from "express";
import { ValidationError } from "./errors/validation-error";
import { errorHandler } from "./middlewares/error-handler";
import apiRoutes from "./routes/index";
require("express-async-errors");

export const app = express();

const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
  );
  next();
});

export async function startServer() {
  app.use(json());

  app.use("/api", apiRoutes);
  app.use(function (err: any, req: any, res: Response, next: any) {
    if (err.name === "UnauthorizedError") {
      res.status(err.status).send({ message: err.message });
      console.error("IP Address:", req.connection.remoteAddress, err.message);
      return;
    }
    // console.log("i am befor error....");
    // if (err instanceof CustomError) {
    //   return res.status(err.statusCode).send({ status: err.statusCode, errors: err.serializeErrors() });
    // } // For any thrown errors in the application
    // Logger.error(err);

    if (err.name == "ValidationError" || err instanceof ValidationError) {
      return res.status(400).json(err);
    }
    res.status(400).send({
      status: 400,
      message: err.message || "Something went wrong",
    });
    next();
  });

  app.use(errorHandler);
  // process.on('unhandledRejection', errorHandler)
}
