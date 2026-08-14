import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
export class RequestJobDto {

    @IsString()
    description!: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;
}