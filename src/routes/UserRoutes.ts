import { validate } from "class-validator";
import express from "express";

import UserController from "../controllers/UserController";

const users = express.Router();

users
  .get("/verify", UserController.verify)
  .post("/login", UserController.login)
  .post("/signup", UserController.signup);

export default users;
