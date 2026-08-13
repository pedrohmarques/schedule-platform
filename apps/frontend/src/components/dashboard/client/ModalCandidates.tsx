"use client";

import MyButton from "@/components/ui/MyButton";
import { patchClientSelect } from "@/services/job.service";
import { JobRequest } from "@/types/Job";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { toast } from "sonner";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requests: JobRequest[]
}

async function professionalSelected(request: JobRequest) {
  try {
    const acceptJob = await patchClientSelect(request.id);
    console.log(acceptJob)
    toast.success(`Pedido de ${request.professional.name} aceito com sucesso.`)
  } catch {
    toast.success(`Não foi possível aceita o pedido de ${request.professional.name}.`)
  }

}

export default function ModalCandidates({ open, requests, onOpenChange }: ModalProps) {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--popover)] p-6 text-[var(--popover-foreground)] shadow-lg">
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-lg font-semibold">Candidatos ao pedido</Dialog.Title>
                <Dialog.Close className="cursor-pointer text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                  <X size={18} />
                </Dialog.Close>
              </div>
              <ul className="mt-4 space-y-3">
                {requests.map((r) => (
                    <li key={r.professionalId} className="rounded-xl border p-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2"><p className="font-medium">{r.professional.name}</p></div>
                            <p className="text-sm text-[var(--primary)] capitalize">{r.professional.area}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <MyButton theme="primary" onClick={() => professionalSelected(r)}>Escolher</MyButton>
                        </div>
                    </li>
                ))}
              </ul>
              
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      );
}