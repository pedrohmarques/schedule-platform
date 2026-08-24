import { IsEnum, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { ServiceArea } from "@prisma/client";

export class CreateJobDto {
    @IsEnum(ServiceArea)
    area!: ServiceArea;

    @IsString()
    title!: string;

    @IsString()
    description!: string;

    @IsNumber()
    @IsPositive()
    price!: number;

    /** Se informado, o job já nasce endereçado a esse profissional específico. */
    @IsOptional()
    @IsString()
    professionalId?: string;
}
