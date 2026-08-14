import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateJobDto } from "./dto/create-job.dto";
import { RequestAction } from "./dto/respond-job-request.dto";
import { JobStatus, RequestStatus } from "@prisma/client";
import { RequestJobDto } from "./dto/request-job.dto";

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
     * Sem professionalId -> job fica OPEN, disponível pra qualquer profissional
     * solicitar (ver requestJob). Com professionalId -> o cliente já está
     * convidando alguém específico, então cria o job + o JobRequest juntos,
     * como PENDING (aguardando esse profissional aceitar/recusar).
     */
    async create(dto: CreateJobDto, clientId: string) {
        const { professionalId, ...jobData } = dto;

        const job = await this.prisma.job.create({
            data: {
                ...jobData,
                clientId,
                status: professionalId ? "PENDING" : "OPEN",
                requests: professionalId
                    ? { create: [{ professionalId, price: jobData.price, description: jobData.description }] }
                    : undefined,
            },
            include: { requests: true },
        });

        return this.toPlainJob(job);
    }

    async findAllRequestsByProfessional(professionalId: string, statuses?: RequestStatus[]) {
        const requests = await this.prisma.jobRequest.findMany({
            where: { 
                professionalId,
                ...(statuses && statuses.length > 0 ? { status: { in: statuses } } : {}),
            },
            orderBy: { createdAt: "desc" },
            include: { job:  {
                    include: { client: { select: {id: true, name: true} }}
                } 
            },
        });

        return requests.map((request) => ({
            ...request,
            job: this.toPlainJob(request.job),
        }));
    }

    async findAllByClient(clientId: string, statuses?: JobStatus[]) {
        const jobs = await this.prisma.job.findMany({
            where: {
                clientId,
                ...(statuses && statuses.length > 0 ? { status: { in: statuses } } : {}),
            },
            orderBy: { createdAt: "desc" },
            include: {
                // join de 2 níveis: Job -> requests (JobRequest) -> professional (Profissional)
                requests: {
                    include: {
                        // select, não "professional: true" -> senão viria o hash da senha junto
                        professional: {
                            select: { id: true, name: true, area: true },
                        },
                    },
                },
            },
        });

        return jobs.map((job) => ({
            ...this.toPlainJob(job),
            requests: job.requests.map((request) => this.toPlainJob(request)),
        }));
    }

    /** Um profissional solicitando um job em aberto (que não tem alvo definido). */
    async requestJob(jobId: string, dto: RequestJobDto, professionalId: string) {
        const job = await this.prisma.job.findUnique({ where: { id: jobId } });

        if (!job) {
            throw new NotFoundException(`Job ${jobId} não encontrado`);
        }

        if (job.status !== "OPEN") {
            throw new BadRequestException("Esse job não está mais disponível para solicitação.");
        }

        const request = await this.prisma.jobRequest.create({
            data: { jobId, professionalId, price: dto?.price || job.price, description: dto.description },
        });

        return this.toPlainJob(request);
    }

    /**
     * O profissional responde a um convite direto do cliente (job criado já
     * com professionalId). Só o profissional-alvo daquele JobRequest pode
     * responder. Recusar reabre o job (status volta pra OPEN) pra qualquer
     * outro profissional poder solicitar.
     */
    async respondAsProfessional(requestId: string, professionalId: string, action: RequestAction) {
        const jobRequest = await this.prisma.jobRequest.findUnique({ where: { id: requestId } });

        if (!jobRequest) {
            throw new NotFoundException(`Solicitação ${requestId} não encontrada`);
        }

        if (jobRequest.professionalId !== professionalId) {
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
    async respondAsClient(requestId: string, clientId: string, action: RequestAction) {
        const jobRequest = await this.prisma.jobRequest.findUnique({
            where: { id: requestId },
            include: { job: true },
        });

        if (!jobRequest) {
            throw new NotFoundException(`Solicitação ${requestId} não encontrada`);
        }

        if (jobRequest.job.clientId !== clientId) {
            throw new ForbiddenException("Esse job não é seu.");
        }

        if (jobRequest.status !== "PENDING") {
            throw new BadRequestException("Essa solicitação já foi respondida.");
        }

        if (action === RequestAction.REJECT) {
            return this.prisma.jobRequest.update({
                where: { id: requestId },
                data: { status: "REJECTED" },
            });
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
    async completeJob(jobId: string, userId: string) {
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
        const isClient = job.clientId === userId;
        const isAssignedProfessional = acceptedRequest?.professionalId === userId;

        if (!isClient && !isAssignedProfessional) {
            throw new ForbiddenException("Você não faz parte desse job.");
        }

        const updated = await this.prisma.job.update({
            where: { id: jobId },
            data: { status: "COMPLETED" },
        });

        return this.toPlainJob(updated);
    }
}
