import { api } from "@/lib/api";
import { Job } from "@/types/Job";

export function getClientRequests() {
    return api<Job[]>('/job/client', {
        method: 'GET'
    });
}
