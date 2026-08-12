import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateJobDto } from "./dto/create-job.dto";
import { RequestAction } from "./dto/respond-job-request.dto";

@Injectable()
export class JobService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Sem professionalId -> job fica OPEN, disponível pra qualquer profissional
     * solicitar (ver requestJob). Com professionalId -> o cliente já está
     * convidando alguém específico, então cria o job + o JobRequest juntos,
     * como PENDING (aguardando esse profissional aceitar/recusar).
     */
    create(dto: CreateJobDto, clientId: string) {
        const { professionalId, ...jobData } = dto;

        return this.prisma.job.create({
            data: {
                ...jobData,
                clientId,
                status: professionalId ? "PENDING" : "OPEN",
                requests: professionalId
                    ? { create: [{ professionalId }] }
                    : undefined,
            },
            include: { requests: true },
        });
    }

    findAllRequestsByProfessional(professionalId: string) {
        return this.prisma.jobRequest.findMany({
            where: { professionalId },
            orderBy: { createdAt: "desc" },
            include: { job: true },
        });
    }

    findAllByClient(clientId: string) {
        return this.prisma.job.findMany({
            where: { clientId },
            orderBy: { createdAt: "desc" },
            include: { requests: true },
        });
    }

    /** Um profissional solicitando um job em aberto (que não tem alvo definido). */
    async requestJob(jobId: string, professionalId: string) {
        const job = await this.prisma.job.findUnique({ where: { id: jobId } });

        if (!job) {
            throw new NotFoundException(`Job ${jobId} não encontrado`);
        }

        if (job.status !== "OPEN") {
            throw new BadRequestException("Esse job não está mais disponível para solicitação.");
        }

        return this.prisma.jobRequest.create({
            data: { jobId, professionalId },
        });
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

        return job;
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
                data: { status: "ACCEPTED" },
            }),
        ]);

        return job;
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

        return this.prisma.job.update({
            where: { id: jobId },
            data: { status: "COMPLETED" },
        });
    }
}
