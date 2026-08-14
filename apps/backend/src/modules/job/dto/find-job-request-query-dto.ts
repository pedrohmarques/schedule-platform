import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { RequestStatus } from "@prisma/client";

export class FindJobRequestQueryDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value.split(",") : value))
  @IsArray()
  @IsEnum(RequestStatus, { each: true })
  status?: RequestStatus[];
}
