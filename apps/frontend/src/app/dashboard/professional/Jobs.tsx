import Status from "@/components/dashboard/Status";
import ModalApplie from "@/components/dashboard/professional/ModalApplie";
import MyButton from "@/components/ui/MyButton";
import Tabs, { Tab } from "@/components/ui/Tab";
import { formatCurrency, formatDate } from "@/lib/format";
import { getAppliedJobs, getJobsByArea } from "@/services/job.service";
import { Job, JobRequest } from "@/types/Job";
import EmptyState from "@/components/ui/EmptyState";
import { Briefcase, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { SERVICE_AREAS } from "@/constants/areas";
import { toast } from "sonner";

interface UserModel {
    userArea: string;
}
export default function Jobs({userArea}: UserModel) {

    const [openJobs, setOpenJobs] = useState<Job[]>([]);
    const [requestedJobs, setRequestedJobs] = useState<JobRequest[]>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    async function fetchOpenJobs() {
        try {
            const jobs = await getJobsByArea([userArea])
            if(jobs) {
                setOpenJobs(jobs)
            }
        } catch {

        }
    }

    async function fetchRequestedJobs() {
        try {
            const requests = await getAppliedJobs(["PENDING"])
            if(requests) {
                setRequestedJobs(requests)
            }
        } catch {
            toast.error("Não foi possivel encontrar nenhuma requisição de trabalho.")
        }
    }

    useEffect(() => {
        fetchOpenJobs()
        fetchRequestedJobs()
    }, [])

    return (
        <div className="mt-4">
            <Tabs>
                <Tab label="Abertas">
                    {openJobs.length === 0 && (
                        <EmptyState
                            icon={Briefcase}
                            title="Não temos vagas abertas"
                            description="Vagas na sua área vão aparecer aqui assim que forem publicadas."
                        />
                    )}
                    <ul className="mt-4 space-y-3">
                        {openJobs.map((job) => (
                            <li key={job.id} className="surface-card flex flex-wrap items-center justify-between gap-4 p-5">
                                <div className="w-full flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <div className="flex flex-col items-start gap-1 w-full">
                                            <div className="flex gap-4">
                                                <p className="text-lg font-semibold truncate">
                                                    {job.title}
                                                </p> 
                                                <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-[var(--secondary)] text-[var(--secondary-foreground)]">
                                                    {job.requests.length} candidato(s)
                                                </div>
                                            </div>
                                            <p className="text-sm font-medium">
                                                {job.client.name} -{" "}
                                                <span className="text-[var(--primary)]">{SERVICE_AREAS.find((service) => service.value === job.area)?.label}</span>
                                            </p>
                                            <div className="flex items-start">
                                                <p className="mt-1 max-w-xl text-sm text-[var(--muted-foreground)]">{job.description}</p>
                                            </div>                                                                                    
                                            
                                        </div>
                                        <p className="mt-3 text-xs text-[var(--muted-foreground)]">{formatDate(job.createdAt)}</p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right flex flex-col gap-4">
                                            <p className="font-semibold">{formatCurrency(job.price)}</p>
                                            <MyButton
                                                theme="primary"
                                                onClick={() => setSelectedJob(job)}
                                            ><Send size={16}/>Candidatar-se</MyButton>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Tab>
                <Tab label="Solicitadas">
                    {requestedJobs.length === 0 && (
                        <EmptyState
                            icon={Send}
                            title="Você ainda não se candidatou a nenhum job"
                            description="As vagas em que você se candidatar vão aparecer aqui."
                        />
                    )}
                    <ul className="mt-4 space-y-3">
                        {requestedJobs.map((request) => (
                            <li key={request.id} className="surface-card flex flex-wrap items-center justify-between gap-4 p-5">
                                <div className="flex flex-col gap-1">
                                    <div className="flex gap-4 items-center">
                                        <p className="text-lg font-semibold truncate">{request.job.title}</p>
                                        <Status type={request.status} />
                                    </div>
                                    <p className="text-sm font-medium">
                                        {request.job.client.name} -{" "}
                                        <span className="text-[var(--primary)]">{SERVICE_AREAS.find((service) => service.value === request.job.area)?.label}</span>
                                    </p>
                                    <p className="mt-1 max-w-xl text-sm text-[var(--muted-foreground)]">{request.job.description}</p>
                                    <p className="mt-3 text-xs text-[var(--muted-foreground)]">{formatDate(request.job.createdAt)}</p>
                                </div>
                                <p className="font-semibold">{formatCurrency(request.price)}</p>
                            </li>
                        ))}
                    </ul>
                </Tab>
            </Tabs>

            {selectedJob && (
                <ModalApplie
                    open={!!selectedJob}
                    job={selectedJob}
                    onOpenChange={(open) => { if (!open) setSelectedJob(null); }}
                    onSubmit={() => {
                        setSelectedJob(null);
                        fetchOpenJobs();
                        fetchRequestedJobs();
                    }}
                />
            )}
        </div>
    )
}