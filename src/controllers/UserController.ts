import { Request, Response } from "express";
import { BadRequestError } from "../errors/bad-request-error";
import UserModel from "../models/UserModel";
import { CustomResponse } from "../utils/custome-response";
import agenda from "../jobs/agenda";
import sendEmail from "../notifications/email";

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
            { email, id: user.id },
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
      const data = await UserModel.createUser(email, password, name);
      CustomResponse.send(res, data);

      //   sendEmail({
      //     email,
      //     subject: "Verfication Email.",
      //     message: "welcome to monitor api please verfie your email.",
      //   });
      // agenda schedual..
      //   const scheduleAgenda = agenda.create("Check Scheduling", { message: "ahlan" });
      //   scheduleAgenda.repeatEvery("5 seconds").save();
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
export default new UserController();
