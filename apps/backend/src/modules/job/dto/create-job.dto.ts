import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateJobDto {
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
