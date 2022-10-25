import { Request, Response } from "express";
import { BadRequestError } from "../errors/bad-request-error";
import UserModel from "../models/UserModel";
import { CustomResponse } from "../utils/custome-response";
import registerEventEmitter from "../events/register";
import mongoose from "mongoose";

class UserController {
  async login(req: Request, res: Response, next: any): Promise<void> {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const passwordHashed = UserModel.getPasswordHashed(password);
        const user = await UserModel.findOne({ email, password: passwordHashed });
        if (user !== null) {
          const accessToken = UserModel.generateToken(
            user._id.toString(),
            { email, id: user._id },
            "2h"
          );
          CustomResponse.send(res, { user, accessToken });
        } else {
          throw new BadRequestError("Invalid credentials");
        }
      } else {
        throw new BadRequestError("Please Provide email & password.");
      }
    } catch (error) {
      next(error);
    }
  }
  async signup(req: Request, res: Response, next: any) {
    try {
      const { email, password, name } = req.body;
      const user = await UserModel.createUser(email, password, name);
      const accessToken = UserModel.generateToken(
        user._id.toString(),
        { email, id: user._id },
        "2h"
      );

      CustomResponse.send(res, { user, accessToken });

      registerEventEmitter.emit("register", { email, name, id: user._id.toString() });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async verify(req: Request, res: Response, next: any) {
    const id = req.query.token;
    try {
      const user = await UserModel.findById(id);
      if (user != null) {
        await UserModel.findByIdAndUpdate(id, { active: true });
        return CustomResponse.send(res, "Email verified.");
      }
      CustomResponse.send(res, {}, "Email not verified.", 400);
    } catch (error) {
      next(error);
    }
  }
}
export default new UserController();
