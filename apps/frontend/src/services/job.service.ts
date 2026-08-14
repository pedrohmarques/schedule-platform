import { api } from "@/lib/api";
import { parseCurrency } from "@/lib/format";
import { Job, JobRequest } from "@/types/Job";

export function getClientRequests(statuses?: string[]) {
    const query = statuses && statuses.length > 0 ? `?status=${statuses.join(',')}` : '';
    return api<Job[]>(`/job/client${query}`, {
        method: 'GET'
    });
}

export function getRequests(statuses?: string[]) {
    const query = statuses && statuses.length > 0 ? `?status=${statuses.join(',')}` : '';
    return api<JobRequest[]>(`/job/professional${query}`, {
        method: 'GET'
    });
}

export function patchClientSelect(requestId: string) {
    return api<Job[]>(`/job/request/${requestId}/client-response`, {
        method: 'PATCH',
        body: JSON.stringify({ action: "accept" })
    });
}

interface JobCreate {
    title: string;
    area: string;
    description: string;
    price: string;
    professionalId?: string;
}
export function createJobRequest(form: JobCreate) {
    return api<Job>('/job', {
        method: 'POST',
        body: JSON.stringify({...form, price: parseCurrency(form.price)})
    });
}
