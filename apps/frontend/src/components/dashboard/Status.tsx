type StatusType = "OPEN" | "PENDING" | "ACCEPTED" | "CANCELLED" | "REJECTED" | "COMPLETED"
interface Status {
    type: StatusType
}

const themeClasses: Record<StatusType, string> = {
    OPEN: 'bg-[var(--muted)] text-[var(--muted-foreground)',
    PENDING: 'bg-[var(--warning)] text-[var(--warning-foreground)]',
    ACCEPTED: 'bg-[var(--success)] text-[var(--success-foreground)]',
    CANCELLED: 'bg-[var(--destructive)] text-[var(--destructive-foreground)]',
    REJECTED: 'bg-[var(--destructive)] text-[var(--destructive-foreground)]',
    COMPLETED: 'bg-[var(--success)] text-[var(--success-foreground)]',
};

const translate = {
    OPEN: "Aberto",
    PENDING: "Pendente",
    ACCEPTED: "Aceito",
    CANCELLED: "Cancelado",
    REJECTED: "Rejeitado",
    COMPLETED: "Finalizado"
}

export default function Status({ type }: Status) {
    return (
        <div className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow border-transparent ${themeClasses[type]}`}>
            {translate[type]}
        </div>
    )
}