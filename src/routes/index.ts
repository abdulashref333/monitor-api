import express, { Express } from "express";
import checks from "./CheckRoutes";
import reports from "./reportRoutes";
import users from "./UserRoutes";

const apiRouter = express.Router();

apiRouter.use("/users", users);
apiRouter.use("/checks", checks);
apiRouter.use("/reports", reports);

export default apiRouter;
