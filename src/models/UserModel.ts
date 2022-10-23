import { getModelForClass, Index, prop, ReturnModelType } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { IsEmail } from "class-validator";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
interface IUserSerialized {
  id: string;
  email: string;
}
@Index({ email: 1 }, { unique: true })
class User extends TimeStamps {
  @prop()
  id?: mongoose.Types.ObjectId;

  @prop({ required: true, minlength: 3 })
  name: string;

  @IsEmail()
  @prop({ required: true })
  email: string;

  @prop({ required: true })
  password: string;

  public static getPasswordHashed(password: string) {
    return crypto.createHash("sha256").update(password).digest("hex");
  }

  public static async createUser(
    this: ReturnModelType<typeof User>,
    email: string,
    password: string,
    name: string
  ) {
    const generatedPassword = password || "P@ssw0rd";

    const passwordHashed = this.getPasswordHashed(generatedPassword);
    return await this.create({
      password: passwordHashed,
      email,
      name,
    });
  }

  public static generateToken(
    subject: string,
    payload: IUserSerialized,
    expiresIn: string
  ) {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn });
    // return jwt.sign(payload, process.env.JWT_SECRET!, {
    //     expiresIn,
    //     algorithm: process.env.JWT_ALGORITHM,
    //     subject,
    //     issuer: process.env.JWT_ISSUER,
    // });
  }
}
const UserModel = getModelForClass(User);
export default UserModel;
