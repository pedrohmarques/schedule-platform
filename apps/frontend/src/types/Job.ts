export interface JobRequestProfessional {
    id: string;
    name: string;
    area: string;
}
export interface JobRequestClient {
    id: string;
    name: string;
}

export interface JobRequest {
    id: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    price: number;
    description: string;
    jobId: string;
    professionalId: string;
    professional: JobRequestProfessional;
    job: Job;
    createdAt: string;
    updatedAt: string;
}

export interface Job {
    id: string;
    clientId: string;
    createdAt: string;
    title: string;
    area: string;
    description: string;
    price: number;
    client: JobRequestClient;
    status: "OPEN" | "PENDING" | "ACCEPTED" | "CANCELLED" | "COMPLETED";
    updatedAt: string;
    requests: JobRequest[];
}
