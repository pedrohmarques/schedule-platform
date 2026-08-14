import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CreateJobDto } from "./dto/create-job.dto";
import { JobService } from "./job.service";
import { CurrentUser, type CurrentUserPayload } from "src/common/decorators/current-user.decorator";
import { RespondJobRequestDto } from "./dto/respond-job-request.dto";
import { FindJobQueryDto } from "./dto/find-job-query.dto";
import { RequestJobDto } from "./dto/request-job.dto";
import { FindJobRequestQueryDto } from "./dto/find-job-request-query-dto";

@Controller('job')
export class JobController {
    constructor(private readonly jobService: JobService){}

    @Post()
    async create(@Body() dto: CreateJobDto, @CurrentUser() user: CurrentUserPayload) {
        return this.jobService.create(dto, user.id)
    }

    @Get('client')
    async findMine(@CurrentUser() user: CurrentUserPayload, @Query() query: FindJobQueryDto) {
        return this.jobService.findAllByClient(user.id, query.status)
    }

    @Get('professional')
    async findRequets(@CurrentUser() user: CurrentUserPayload, @Query() query: FindJobRequestQueryDto) {
        return this.jobService.findAllRequestsByProfessional(user.id, query.status)
    }

    @Post(':id/request')
    async requestJob(@Param('id') id: string, @Body() dto: RequestJobDto, @CurrentUser() user: CurrentUserPayload) {
        return this.jobService.requestJob(id, dto, user.id)
    }

    /** Profissional aceita/recusa um convite direto do cliente. */
    @Patch('request/:requestId/professional-response')
    async professionalResponse(
        @Param('requestId') requestId: string,
        @Body() dto: RespondJobRequestDto,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.jobService.respondAsProfessional(requestId, user.id, dto.action);
    }

    /** Cliente aceita/recusa a candidatura de um profissional a um job aberto. */
    @Patch('request/:requestId/client-response')
    async clientResponse(
        @Param('requestId') requestId: string,
        @Body() dto: RespondJobRequestDto,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.jobService.respondAsClient(requestId, user.id, dto.action);
    }

    /** Cliente ou o profissional confirmado marcam o job como concluído. */
    @Patch(':id/complete')
    async complete(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
        return this.jobService.completeJob(id, user.id);
    }
}
