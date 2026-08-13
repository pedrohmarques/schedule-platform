import { api } from "@/lib/api";
import { Job } from "@/types/Job";

export function getClientRequests() {
    return api<Job[]>('/job/client', {
        method: 'GET'
    });
}

export function patchClientSelect(requestId: string) {
    return api<Job[]>(`/job/request/${requestId}/client-response`, {
        method: 'PATCH',
        body: JSON.stringify({ action: "accept" })
    });
}
