import { IsBoolean, IsEnum, IsNotEmpty } from "class-validator";
import { Protocols } from "../enums";

export class CheckInput {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  url: string;

  @IsNotEmpty()
  @IsEnum(Protocols)
  protocol: string;

  @IsBoolean()
  ignoreSSL: boolean;
}
