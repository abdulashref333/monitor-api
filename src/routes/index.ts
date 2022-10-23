import express, { Express } from "express";
import checks from "./CheckRoutes";
import users from "./UserRoutes";

const apiRouter = express.Router();

apiRouter.use("/users", users);
apiRouter.use("/checks", checks);

export default apiRouter;
