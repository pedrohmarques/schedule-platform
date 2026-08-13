"use client";
import MyButton from "@/components/ui/MyButton";
import { getClientRequests } from "@/services/job.service";
import { Job } from "@/types/Job";
import { formatCurrency, formatDate } from "@/lib/format";
import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import Status from "@/components/dashboard/Status";
import ModalCandidates from "@/components/dashboard/client/ModalCandidates";

interface StoredUser {
    name: string;
    email: string;
}

export default function DashboardClient() {
    const [user, setUser] = useState<StoredUser | null>(null);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    useEffect(() => {
        const raw = sessionStorage.getItem("user");
        if (raw) {
            setUser(JSON.parse(raw));
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jobs = await getClientRequests()
                if(jobs) {
                    setJobs(jobs)
                }
            } catch {

            }
        }

        fetchData()
    }, [])

    return (
        <div className="min-h-screen bg-[var(--surface)]">
            <main className="mx-auto max-w-6xl px-6 pb-24 pt-10">
                <h1 className="text-3xl font-semibold">Olá, {user?.name}</h1>
                <p className="mt-2 max-w-2xl text-sm text-[var(--muted-foreground)]">Escolha um profissional, proponha o valor e descreva o serviço. Ele irá receber o pedido e decidir se aceita.</p>

                <div className="mt-8">
                    <section className="mt-6">
                        <div className="flex justify-between mx-auto max-w-6xl">
                            <h2 className="text-lg font-semibold">Meus pedidos</h2>
                            <MyButton theme="primary">Solicitar serviço</MyButton>
                        </div>

                        <div className="mt-4 space-y-3">
                            {jobs.length === 0 && (
                                <p className="text-sm text-[var(--muted-foreground)]">Você ainda não fez nenhum pedido.</p>
                            )}
                            <ul className="mt-4 space-y-3">
                                {jobs.map((job) => (
                                    <li key={job.id} className="surface-card flex flex-wrap items-center justify-between gap-4 p-5">
                                        <div className="w-full flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    {(job.status === "PENDING" || job.status === "ACCEPTED") && (
                                                        <p className="font-medium capitalize">{job.requests[0].professional.name} - {job.requests[0].professional.area}</p> 
                                                    )}                                                
                                                    <Status type={job.status} />
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
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <ModalCandidates
                                requests={selectedJob?.requests ?? []}
                                open={selectedJob !== null}
                                onOpenChange={(open) => !open && setSelectedJob(null)}
                            />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}
