import {
  getModelForClass,
  Index,
  modelOptions,
  Prop,
  Severity,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import mongoose from "mongoose";
import { Status } from "./enums";

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
@Index({ checkId: 1 })
export class Report extends TimeStamps {
  @Prop({ required: true })
  checkId: mongoose.Types.ObjectId;

  @Prop({ required: true, enum: Status })
  status: string;

  @Prop({ required: true })
  availability: number;

  @Prop({ required: true })
  outages: number;

  @Prop({ required: true })
  downtime: number;

  @Prop({ required: true })
  uptime: number;

  @Prop({ required: true })
  responseTime: number;

  @Prop({ required: true })
  history: Date[];

  @Prop({ default: false })
  isDeleted?: boolean;
}

export const ReportModel = getModelForClass(Report);
