import {
  getModelForClass,
  Index,
  modelOptions,
  Prop,
  prop,
  Severity,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { warnMixed } from "@typegoose/typegoose/lib/internal/utils";
import { Allow, Contains, IsBoolean, IsEnum, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";
import { Protocols } from "./enums";

interface IAuthentaction {
  username: string;
  password: string;
}

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
@Index({ userId: 1, isDeleted: 1 })
export class Check extends TimeStamps {
  @prop({ required: true })
  userId: mongoose.Types.ObjectId;

  @prop({ required: true })
  email: string;

  @IsNotEmpty()
  @prop({ required: true })
  name: string;

  @IsNotEmpty()
  @prop({ required: true })
  url: string;

  @IsNotEmpty()
  @IsEnum(Protocols)
  @prop({ required: true, enum: Protocols })
  protocol: string;

  @IsBoolean()
  @prop({ required: true })
  ignoreSSL: boolean;

  @prop()
  jobId?: string;

  @prop()
  port?: number;

  @prop({ default: 5000 })
  timeout?: number;

  @prop({ default: "10 minutes" })
  interval?: string;

  @prop({ default: 1 })
  threshold?: number;

  @prop()
  authentication?: IAuthentaction;

  @prop()
  tags?: [string];

  @prop({ default: 0 })
  countFault?: number;

  @Prop({ default: false })
  isDeleted?: boolean;
}
export const CheckModel = getModelForClass(Check);
