import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateJobDto } from "./dto/create-job.dto";
import { RequestAction } from "./dto/respond-job-request.dto";
import { JobStatus, Prisma, RequestOrigin, RequestStatus, ServiceArea } from "@prisma/client";
import { RequestJobDto } from "./dto/request-job.dto";
import type { CurrentUserPayload } from "src/common/decorators/current-user.decorator";

/**
 * ClientProfile e ProfessionalProfile guardam só o vínculo com User — nome,
 * telefone e endereço moram em User. Esses selects trazem o mínimo de cada
 * lado; o achatamento acontece em toClient/toProfessional, logo abaixo.
 */
const clientSelect = {
    id: true,
    user: { select: { name: true } },
} satisfies Prisma.ClientProfileSelect;

const professionalSelect = {
    id: true,
    area: true,
    user: { select: { name: true } },
} satisfies Prisma.ProfessionalProfileSelect;

@Injectable()
export class JobService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Prisma retorna `price` (Decimal) como um objeto interno ({s, e, d}),
     * não como number puro — isso quebra o front (`Number({s,e,d})` = NaN).
     * Convertemos pra number antes de devolver pra API.
     */
    private toPlainJob<T extends { price: unknown }>(job: T): T & { price: number } {
        return { ...job, price: Number(job.price) };
    }

    /**
     * Achata ClientProfile + User em { id, name }, que é o formato que o
     * frontend já consome (types/Job.ts). Manter esse formato é o que evita
     * ter que mexer nas telas de dashboard.
     */
    private toClient(client: { id: string; user: { name: string } }) {
        return { id: client.id, name: client.user.name };
    }

    private toProfessional(professional: {
        id: string;
        area: ServiceArea;
        user: { name: string };
    }) {
        return {
            id: professional.id,
            area: professional.area,
            name: professional.user.name,
        };
    }

    async findJobByArea(professionalProfileId: string, areas?: ServiceArea[]) {
        const jobs = await this.prisma.job.findMany({
            where: {
                requests: { none: { professionalId: professionalProfileId } },
                status: "OPEN",
                ...(areas && areas.length > 0 ? { area: { in: areas } } : {}),
            },
            orderBy: { createdAt: "desc" },
            include: {
                requests: true,
                client: { select: clientSelect },
            },
        });

        return jobs.map((job) => ({
            ...this.toPlainJob(job),
            client: this.toClient(job.client),
            requests: job.requests.map((request) => this.toPlainJob(request)),
        }));
    }

    async create(dto: CreateJobDto, clientProfileId: string) {
        const { professionalId, ...jobData } = dto;

        const job = await this.prisma.job.create({
            data: {
                ...jobData,
                clientId: clientProfileId,
                status: professionalId ? "PENDING" : "OPEN",
                requests: professionalId
                    ? {
                          create: [
                              {
                                  // ProfessionalProfile.id, não User.id
                                  professionalId,
                                  price: jobData.price,
                                  description: jobData.description,
                                  origin: "CLIENT_INVITE",
                              },
                          ],
                      }
                    : undefined,
            },
            include: { requests: true },
        });

        return this.toPlainJob(job);
    }

    async findAllRequestsByProfessional(
        professionalProfileId: string,
        statuses?: RequestStatus[],
        origins?: RequestOrigin[],
    ) {
        const requests = await this.prisma.jobRequest.findMany({
            where: {
                professionalId: professionalProfileId,
                ...(statuses && statuses.length > 0 ? { status: { in: statuses } } : {}),
                ...(origins && origins.length > 0 ? { origin: { in: origins } } : {}),
            },
            orderBy: { createdAt: "desc" },
            include: {
                job: {
                    include: { client: { select: clientSelect } },
                },
            },
        });

        return requests.map((request) => ({
            ...this.toPlainJob(request),
            job: {
                ...this.toPlainJob(request.job),
                client: this.toClient(request.job.client),
            },
        }));
    }

    async findAllByClient(clientProfileId: string, statuses?: JobStatus[]) {
        const jobs = await this.prisma.job.findMany({
            where: {
                clientId: clientProfileId,
                ...(statuses && statuses.length > 0 ? { status: { in: statuses } } : {}),
            },
            orderBy: { createdAt: "desc" },
            include: {
                // join de 2 níveis: Job -> requests (JobRequest) -> professional
                requests: {
                    include: {
                        // select, não "professional: true" -> senão viria o perfil inteiro
                        professional: { select: professionalSelect },
                    },
                },
            },
        });

        return jobs.map((job) => ({
            ...this.toPlainJob(job),
            requests: job.requests.map((request) => ({
                ...this.toPlainJob(request),
                professional: this.toProfessional(request.professional),
            })),
        }));
    }

    /** Um profissional solicitando um job em aberto (que não tem alvo definido). */
    async requestJob(jobId: string, dto: RequestJobDto, professionalProfileId: string) {
        const job = await this.prisma.job.findUnique({ where: { id: jobId } });

        if (!job) {
            throw new NotFoundException(`Job ${jobId} não encontrado`);
        }

        if (job.status !== "OPEN") {
            throw new BadRequestException("Esse job não está mais disponível para solicitação.");
        }

        const request = await this.prisma.jobRequest.create({
            data: {
                jobId,
                professionalId: professionalProfileId,
                price: dto?.price || job.price,
                description: dto.description,
                origin: "PROFESSIONAL_APPLICATION",
            },
        });

        return this.toPlainJob(request);
    }

    /**
     * O profissional responde a um convite direto do cliente (job criado já
     * com professionalId). Só o profissional-alvo daquele JobRequest pode
     * responder. Recusar reabre o job (status volta pra OPEN) pra qualquer
     * outro profissional poder solicitar.
     */
    async respondAsProfessional(
        requestId: string,
        professionalProfileId: string,
        action: RequestAction,
    ) {
        const jobRequest = await this.prisma.jobRequest.findUnique({ where: { id: requestId } });

        if (!jobRequest) {
            throw new NotFoundException(`Solicitação ${requestId} não encontrada`);
        }

        if (jobRequest.professionalId !== professionalProfileId) {
            throw new ForbiddenException("Essa solicitação não é sua.");
        }

        if (jobRequest.status !== "PENDING") {
            throw new BadRequestException("Essa solicitação já foi respondida.");
        }

        const accepted = action === RequestAction.ACCEPT;

        const [, job] = await this.prisma.$transaction([
            this.prisma.jobRequest.update({
                where: { id: requestId },
                data: { status: accepted ? "ACCEPTED" : "REJECTED" },
            }),
            this.prisma.job.update({
                where: { id: jobRequest.jobId },
                data: { status: accepted ? "ACCEPTED" : "OPEN" },
            }),
        ]);

        return this.toPlainJob(job);
    }

    /**
     * O cliente responde a uma candidatura de um profissional (job estava
     * OPEN e o profissional solicitou via requestJob). Só o dono do job pode
     * responder. Ao aceitar, as outras candidaturas pendentes desse job são
     * automaticamente recusadas.
     */
    async respondAsClient(requestId: string, clientProfileId: string, action: RequestAction) {
        const jobRequest = await this.prisma.jobRequest.findUnique({
            where: { id: requestId },
            include: { job: true },
        });

        if (!jobRequest) {
            throw new NotFoundException(`Solicitação ${requestId} não encontrada`);
        }

        if (jobRequest.job.clientId !== clientProfileId) {
            throw new ForbiddenException("Esse job não é seu.");
        }

        if (jobRequest.status !== "PENDING") {
            throw new BadRequestException("Essa solicitação já foi respondida.");
        }

        if (action === RequestAction.REJECT) {
            const rejected = await this.prisma.jobRequest.update({
                where: { id: requestId },
                data: { status: "REJECTED" },
            });

            return this.toPlainJob(rejected);
        }

        const [, , job] = await this.prisma.$transaction([
            this.prisma.jobRequest.update({
                where: { id: requestId },
                data: { status: "ACCEPTED" },
            }),
            this.prisma.jobRequest.updateMany({
                where: { jobId: jobRequest.jobId, id: { not: requestId }, status: "PENDING" },
                data: { status: "REJECTED" },
            }),
            this.prisma.job.update({
                where: { id: jobRequest.jobId },
                data: { status: "ACCEPTED", price: jobRequest.price },
            }),
        ]);

        return this.toPlainJob(job);
    }

    /** Cliente ou o profissional confirmado marcam o job como concluído. */
    async completeJob(jobId: string, user: CurrentUserPayload) {
        const job = await this.prisma.job.findUnique({
            where: { id: jobId },
            include: { requests: true },
        });

        if (!job) {
            throw new NotFoundException(`Job ${jobId} não encontrado`);
        }

        if (job.status !== "ACCEPTED") {
            throw new BadRequestException("Só é possível concluir um job que já foi aceito.");
        }

        const acceptedRequest = job.requests.find((r) => r.status === "ACCEPTED");

        // Job ACCEPTED sem request aceito é estado inconsistente: 400, não 500.
        if (!acceptedRequest) {
            throw new BadRequestException(
                "Esse job está aceito mas não tem profissional confirmado.",
            );
        }

        const isClient = user.role === "client" && job.clientId === user.profileId;
        const isAssignedProfessional =
            user.role === "professional" &&
            acceptedRequest.professionalId === user.profileId;

        if (!isClient && !isAssignedProfessional) {
            throw new ForbiddenException("Você não faz parte desse job.");
        }

        const [, updated] = await this.prisma.$transaction([
            this.prisma.jobRequest.update({
                where: { id: acceptedRequest.id },
                data: { status: "COMPLETED" },
            }),
            this.prisma.job.update({
                where: { id: jobId },
                data: { status: "COMPLETED" },
            }),
        ]);

        return this.toPlainJob(updated);
    }
}
