import { IsEnum } from "class-validator";

export enum RequestAction {
    ACCEPT = "accept",
    REJECT = "reject",
}

export class RespondJobRequestDto {
    @IsEnum(RequestAction)
    action!: RequestAction;
}
