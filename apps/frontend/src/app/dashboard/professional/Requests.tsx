"use client";

import Status from "@/components/dashboard/Status";
import MyButton from "@/components/ui/MyButton";
import { formatCurrency, formatDate } from "@/lib/format";
import EmptyState from "@/components/ui/EmptyState";
import { getRequests, professionalSelect } from "@/services/job.service";
import { Job, JobRequest } from "@/types/Job";
import { Check, Inbox, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";


type FilterStatus = "REJECTED" | "PENDING" | "ACCEPTED" | "CANCELLED" | "COMPLETED"

const filterStausClass = `inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-[var(--input)] bg-[var(--background)] shadow-sm h-8 rounded-md px-3 text-xs`
const activeFilterClass = "bg-[var(--accent)]! text-[var(--accent-foreground)]!"

const STATUS_FILTERS: { label: string; value: FilterStatus }[] = [
    { label: "Pendente", value: "PENDING" },
    { label: "Aceito", value: "ACCEPTED" }
]
const STATUS_FILTERS_HISTORY: { label: string; value: FilterStatus }[] = [
    { label: "Finalizado", value: "COMPLETED" },
    { label: "Rejeitado", value: "REJECTED" }
]

interface RequestModel {
    isHistory: boolean;
}
export default function Requests({ isHistory }: RequestModel) {

    const [requests, setRequests] = useState<JobRequest[]>([]);
    const [statusFilter, setStatusFilter] = useState<FilterStatus[]>(isHistory ? ["COMPLETED", "REJECTED"] : ["PENDING", "ACCEPTED"]);

    function toggleStatus(status: FilterStatus) {
        setStatusFilter((prev) =>
            prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
        )
    }

    async function professionalResponse(requestId: string, action: "accept" | "reject" ) {
        try {
            const res: Job = await professionalSelect(requestId, action);
            fetchJobRequests()
            toast.success(`Pedido ${res.title} ${action === "accept" ? 'aceito' : 'rejeitado'} com sucesso.`)
        } catch {

        }
    }

    async function fetchJobRequests() {
        try {
            const requests = await getRequests(statusFilter, ['CLIENT_INVITE', "PROFESSIONAL_APPLICATION"])
            if(isHistory) {
                setRequests(requests)
                return;
            }

            if(requests) {
                const filtered = requests.filter((request) =>
                    request.origin === "CLIENT_INVITE" || request.status === "ACCEPTED"
                )
                setRequests(filtered)
            }
            
        } catch {

        }
    }

    useEffect(() => {
        fetchJobRequests()
    }, [statusFilter])

    return (
        <div className="">
            <div className="mt-4 flex flex-wrap gap-4">
                {(isHistory ? STATUS_FILTERS_HISTORY : STATUS_FILTERS).map(({ label, value }) => (
                    <button
                        key={value}
                        onClick={() => toggleStatus(value)}
                        className={`${filterStausClass} ${statusFilter.includes(value) ? activeFilterClass : ""}`}
                    >
                        {label}
                    </button>
                ))}
            </div>
            {requests.length === 0 && (
                <EmptyState
                    icon={Inbox}
                    title="Nenhum pedido por aqui"
                    description="Convites de clientes e candidaturas aceitas aparecem aqui."
                />
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
                                    {request.status === "PENDING" && (
                                        <div className="flex gap-4">
                                            <MyButton 
                                                onClick={() => professionalResponse(request.id, "accept")}
                                                theme="primary"><Check size={16}/> Aceitar</MyButton>
                                            <MyButton 
                                                onClick={() => professionalResponse(request.id, "reject")}
                                                theme="secondary"><X size={16}/>Rejeitar</MyButton>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}