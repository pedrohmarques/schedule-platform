import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { JobStatus, ServiceArea } from "@prisma/client";

// O retorno anotado como string[] é o que evita o @typescript-eslint/no-unsafe-return
// que o lint acusava aqui — sem ele, `value` é any e contamina a saída.
const splitCsv = ({ value }: { value: unknown }): string[] =>
  typeof value === "string" ? value.split(",") : (value as string[]);

export class FindJobQueryDto {
  // aceita ?status=OPEN,ACCEPTED (uma string separada por vírgula) e
  // transforma em array antes de validar cada item contra o enum
  @IsOptional()
  @Transform(splitCsv)
  @IsArray()
  @IsEnum(JobStatus, { each: true })
  status?: JobStatus[];

  @IsOptional()
  @Transform(splitCsv)
  @IsArray()
  @IsEnum(ServiceArea, { each: true })
  area?: ServiceArea[];
}
