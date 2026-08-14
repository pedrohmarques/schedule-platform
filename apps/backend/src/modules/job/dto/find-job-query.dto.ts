import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { JobStatus } from "@prisma/client";

export class FindJobQueryDto {
  // aceita ?status=OPEN,ACCEPTED (uma string separada por vírgula) e
  // transforma em array antes de validar cada item contra o enum
  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value.split(",") : value))
  @IsArray()
  @IsEnum(JobStatus, { each: true })
  status?: JobStatus[];
}
