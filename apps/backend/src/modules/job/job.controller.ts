import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CreateJobDto } from "./dto/create-job.dto";
import { JobService } from "./job.service";
import { CurrentUser, type CurrentUserPayload } from "src/common/decorators/current-user.decorator";
import { Roles } from "src/common/decorators/roles.decorator";
import { RespondJobRequestDto } from "./dto/respond-job-request.dto";
import { FindJobQueryDto } from "./dto/find-job-query.dto";
import { RequestJobDto } from "./dto/request-job.dto";
import { FindJobRequestQueryDto } from "./dto/find-job-request-query-dto";

/**
 * Regra deste controller: o service recebe sempre `user.profileId`
 * (ClientProfile.id ou ProfessionalProfile.id), nunca `user.id` — que é o
 * User.id e não é o que Job.clientId/JobRequest.professionalId referenciam.
 */
@Controller('job')
export class JobController {
    constructor(private readonly jobService: JobService){}

    @Get()
    @Roles('professional')
    async findJobByArea(@Query() query: FindJobQueryDto, @CurrentUser() user: CurrentUserPayload) {
        return this.jobService.findJobByArea(user.profileId, query.area);
    }

    @Post()
    @Roles('client')
    async create(@Body() dto: CreateJobDto, @CurrentUser() user: CurrentUserPayload) {
        return this.jobService.create(dto, user.profileId)
    }

    @Get('client')
    @Roles('client')
    async findMine(@CurrentUser() user: CurrentUserPayload, @Query() query: FindJobQueryDto) {
        return this.jobService.findAllByClient(user.profileId, query.status)
    }

    @Get('professional')
    @Roles('professional')
    async findRequests(@CurrentUser() user: CurrentUserPayload, @Query() query: FindJobRequestQueryDto) {
        return this.jobService.findAllRequestsByProfessional(user.profileId, query.status, query.origin)
    }

    @Post(':id/request')
    @Roles('professional')
    async requestJob(@Param('id') id: string, @Body() dto: RequestJobDto, @CurrentUser() user: CurrentUserPayload) {
        return this.jobService.requestJob(id, dto, user.profileId)
    }

    /** Profissional aceita/recusa um convite direto do cliente. */
    @Patch('request/:requestId/professional-response')
    @Roles('professional')
    async professionalResponse(
        @Param('requestId') requestId: string,
        @Body() dto: RespondJobRequestDto,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.jobService.respondAsProfessional(requestId, user.profileId, dto.action);
    }

    /** Cliente aceita/recusa a candidatura de um profissional a um job aberto. */
    @Patch('request/:requestId/client-response')
    @Roles('client')
    async clientResponse(
        @Param('requestId') requestId: string,
        @Body() dto: RespondJobRequestDto,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.jobService.respondAsClient(requestId, user.profileId, dto.action);
    }

    /** Cliente ou o profissional confirmado marcam o job como concluído. */
    @Patch(':id/complete')
    async complete(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
        return this.jobService.completeJob(id, user);
    }
}
