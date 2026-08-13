export interface JobRequestProfessional {
    id: string;
    name: string;
    area: string;
}

export interface JobRequest {
    id: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    jobId: string;
    professionalId: string;
    professional: JobRequestProfessional;
    createdAt: string;
    updatedAt: string;
}

export interface Job {
    id: string;
    clientId: string;
    createdAt: string;
    description: string;
    price: number;
    status: "OPEN" | "PENDING" | "ACCEPTED" | "CANCELLED" | "COMPLETED";
    updatedAt: string;
    requests: JobRequest[];
}
