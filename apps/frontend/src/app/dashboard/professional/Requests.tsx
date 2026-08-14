"use client";

import Status from "@/components/dashboard/Status";
import MyButton from "@/components/ui/MyButton";
import { formatCurrency, formatDate } from "@/lib/format";
import { getRequests } from "@/services/job.service";
import { JobRequest } from "@/types/Job";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";

type FilterStatus = "REJECTED" | "PENDING" | "ACCEPTED" | "CANCELLED" | "COMPLETED"

export default function Requests() {

    const [requests, setRequests] = useState<JobRequest[]>([]);
    const [statusFilter, setStatusFilter] = useState<FilterStatus[]>(["PENDING"]);

    async function fetchJobRequests() {
        try {
            const requests = await getRequests(statusFilter)
            if(requests) {
                setRequests(requests)
            }
        } catch {

        }
    }

    useEffect(() => {
        fetchJobRequests()
    }, [statusFilter])

    return (
        <div className="">
            {requests.length === 0 && (
                <p className="text-sm text-[var(--muted-foreground)]">Você ainda não fez nenhum pedido.</p>
            )}
            <ul className="mt-4 space-y-3">
                {requests.map((request) => (
                    <li key={request.id} className="surface-card flex flex-wrap items-center justify-between gap-4 p-5">
                        <div className="w-full flex justify-between items-center">
                            <div className="flex flex-col">
                                <div className="flex flex-col items-start gap-1 w-full">
                                    <div className="flex gap-4">
                                        <p className="text-lg font-semibold truncate">
                                            {request?.job.client.name}
                                        </p> 
                                        <Status type={request.status} />
                                    </div>
                                    <div className="flex items-start">
                                        <p className="mt-1 max-w-xl text-sm text-[var(--muted-foreground)]">{request.job.description}</p>
                                    </div>                                                                                    
                                    
                                </div>
                                <p className="mt-3 text-xs text-[var(--muted-foreground)]">{formatDate(request.job.createdAt)}</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right flex flex-col gap-4">
                                    <p className="font-semibold">{formatCurrency(request.job.price)}</p>
                                    <div className="flex gap-4">
                                        <MyButton 
                                            theme="primary"><Check size={16}/> Aceitar</MyButton>
                                        <MyButton 
                                            theme="secondary"><X size={16}/>Rejeitar</MyButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}