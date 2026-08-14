"use client";
import MyButton from "@/components/ui/MyButton";
import { completeJob, getClientRequests } from "@/services/job.service";
import { Job } from "@/types/Job";
import { formatCurrency, formatDate } from "@/lib/format";
import { useEffect, useState } from "react";
import { Users, Check, ClipboardList } from "lucide-react";
import Status from "@/components/dashboard/Status";
import EmptyState from "@/components/ui/EmptyState";
import ModalCandidates from "@/components/dashboard/client/ModalCandidates";
import ModalRequest from "@/components/dashboard/client/ModalRequest";
import { SERVICE_AREAS } from "@/constants/areas";
import { toast } from "sonner";

interface StoredUser {
    name: string;
    email: string;
}
type FilterStatus = "OPEN" | "PENDING" | "ACCEPTED" | "CANCELLED" | "COMPLETED"

const filterStausClass = `inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-[var(--input)] bg-[var(--background)] shadow-sm h-8 rounded-md px-3 text-xs`
const activeFilterClass = "bg-[var(--accent)]! text-[var(--accent-foreground)]!"

const STATUS_FILTERS: { label: string; value: FilterStatus }[] = [
    { label: "Aberto", value: "OPEN" },
    { label: "Pendente", value: "PENDING" },
    { label: "Aceito", value: "ACCEPTED" },
    { label: "Completo", value: "COMPLETED" },
]

export default function DashboardClient() {
    const [user, setUser] = useState<StoredUser | null>(null);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [statusFilter, setStatusFilter] = useState<FilterStatus[]>(["OPEN", "ACCEPTED", "PENDING", "COMPLETED"]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [requestJob, setRequestJob] = useState<boolean | null>(false);

    useEffect(() => {
        const raw = sessionStorage.getItem("user");
        if (raw) {
            setUser(JSON.parse(raw));
        }
    }, []);

    async function finishJob(job: Job) {
        try {
            const completedJob = await completeJob(job.id)
            toast.success(`Pedido ${job.title} concluido com sucesso.`)
            fetchJobs()
        } catch {
            toast.success(`Não foi possivel concluir o ${job.title}.`)
        }
    }

    async function fetchJobs() {
        try {
            const jobs = await getClientRequests(statusFilter)
            if(jobs) {
                setJobs(jobs)
            }
        } catch {

        }
    }

    function toggleStatus(status: FilterStatus) {
        setStatusFilter((prev) =>
            prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
        )
    }

    useEffect(() => {
        fetchJobs()
    }, [statusFilter])

    return (
        <div className="min-h-screen bg-[var(--surface)]">
            <main className="mx-auto max-w-6xl px-6 pb-24 pt-10">
                <h1 className="text-3xl font-semibold">Olá, {user?.name}</h1>
                <p className="mt-2 max-w-2xl text-sm text-[var(--muted-foreground)]">Escolha um profissional, proponha o valor e descreva o serviço. Ele irá receber o pedido e decidir se aceita.</p>

                <div className="mt-8">
                    <section className="mt-6">
                        <div className="flex justify-between mx-auto max-w-6xl">
                            <h2 className="text-lg font-semibold">Meus pedidos</h2>
                            <MyButton theme="primary" onClick={() => { setRequestJob(true) }}>Solicitar serviço</MyButton>
                            <ModalRequest 
                                open={!!requestJob}
                                onOpenChange={(open) => !open && setRequestJob(false)}
                                onSubmit={() => {
                                    setRequestJob(false)
                                    fetchJobs()
                                }}
                            />
                        </div>

                        <div className="mt-4 flex flex-wrap gap-4">
                            {STATUS_FILTERS.map(({ label, value }) => (
                                <button
                                    key={value}
                                    onClick={() => toggleStatus(value)}
                                    className={`${filterStausClass} ${statusFilter.includes(value) ? activeFilterClass : ""}`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        <div className="mt-4 space-y-3">
                            {jobs.length === 0 && (
                                <EmptyState
                                    icon={ClipboardList}
                                    title="Você ainda não fez nenhum pedido"
                                    description="Seus pedidos de serviço vão aparecer aqui assim que forem criados."
                                />
                            )}
                            <ul className="mt-4 space-y-3">
                                {jobs.map((job) => (
                                    <li key={job.id} className="surface-card flex flex-wrap items-center justify-between gap-4 p-5">
                                        <div className="w-full flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <div className="flex flex-col items-start gap-1 w-full">
                                                    <div className="flex gap-4">
                                                        <p className="text-lg font-semibold truncate">
                                                            {job.title}
                                                        </p> 
                                                        <Status type={job.status} />
                                                    </div>
                                                    <div className="flex items-start">
                                                        {(job.status === "PENDING" || job.status === "ACCEPTED") && (
                                                            <p className="text-sm font-medium capitalize">
                                                                {job.requests[0].professional.name} -{" "}
                                                                <span className="text-[var(--primary)]">{SERVICE_AREAS.find((service) => service.value === job.requests[0].professional.area)?.label}</span>
                                                            </p>
                                                        )}
                                                        {(job.status === "OPEN" && job.requests.length === 0) && (
                                                            <p className="font-medium text-sm text-[var(--primary)]">{SERVICE_AREAS.find((service) => service.value === job.area)?.label}</p>
                                                        )} 
                                                    </div>                                                                                    
                                                    
                                                </div>
                                                <p className="mt-1 max-w-xl text-sm text-[var(--muted-foreground)]">{job.description}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="font-semibold">{formatCurrency(job.price)}</p>
                                                    <p className="text-xs text-[var(--muted-foreground)]">{formatDate(job.createdAt)}</p>
                                                </div>
                                                {job.status === "OPEN" && job.requests.some(r => r.status === "PENDING") && (
                                                    <button
                                                        onClick={() => { setSelectedJob(job) }}
                                                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-[var(--input)] bg-[var(--background)] shadow-sm hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] h-8 rounded-md px-3 text-xs">
                                                        <Users size={16}/> Ver candidatos
                                                    </button>
                                                )}
                                                {job.status === "ACCEPTED" && (
                                                    <MyButton onClick={()=>finishJob(job)} theme="primary"><Check size={16}></Check></MyButton>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <ModalCandidates
                                requests={selectedJob?.requests ?? []}
                                open={selectedJob !== null}
                                onOpenChange={(open) => !open && setSelectedJob(null)}
                                onSelected={() => {
                                    setSelectedJob(null)
                                    fetchJobs()
                                }}
                            />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}
