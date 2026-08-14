import { api } from "@/lib/api";
import { parseCurrency } from "@/lib/format";
import { Job, JobRequest } from "@/types/Job";

export function getClientRequests(statuses?: string[]) {
    const query = statuses && statuses.length > 0 ? `?status=${statuses.join(',')}` : '';
    return api<Job[]>(`/job/client${query}`, {
        method: 'GET'
    });
}

export function getRequests(statuses?: string[], origins?: string[]) {
    const params = new URLSearchParams();
    if (statuses && statuses.length > 0) params.set('status', statuses.join(','));
    if (origins && origins.length > 0) params.set('origin', origins.join(','));
    const query = params.toString() ? `?${params.toString()}` : '';
    return api<JobRequest[]>(`/job/professional${query}`, {
        method: 'GET'
    });
}

export function getAppliedJobs(statuses?: string[]) {
    return getRequests(statuses, ['PROFESSIONAL_APPLICATION']);
}

export function getJobsByArea(area?: string[]) {
    const query = area && area.length > 0 ? `?area=${area.join(',')}` : '';
    return api<Job[]>(`/job${query}`, {
        method: 'GET'
    });
}

export function patchClientSelect(requestId: string) {
    return api<Job[]>(`/job/request/${requestId}/client-response`, {
        method: 'PATCH',
        body: JSON.stringify({ action: "accept" })
    });
}

interface JobApplie {
    price?: string;
    description: string;
}
export function applieJob(jobId: string, form: JobApplie) {
    return api<Job>(`/job/${jobId}/request`, {
        method: 'POST',
        body: JSON.stringify({...form, price: form.price ? parseCurrency(form.price) : null })
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

export function professionalSelect(requestId: string, action: "accept" | "reject") {
    return api<Job>(`/job/request/${requestId}/professional-response`, {
        method: 'PATCH',
        body: JSON.stringify({ action: action })
    });
}

export function completeJob(jobId: string) {
    return api<Job>(`/job/${jobId}/complete`, {
        method: 'PATCH'
    });
}
