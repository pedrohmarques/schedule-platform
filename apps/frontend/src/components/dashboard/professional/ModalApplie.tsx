"use client";

import MaskedInput from "@/components/ui/MaskedInput";
import MyButton from "@/components/ui/MyButton";
import Textarea from "@/components/ui/Textarea";
import { applieJob, createJobRequest } from "@/services/job.service";
import { Job } from "@/types/Job";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ModalProps {
  open: boolean;
  job: Job;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}

export default function ModalApplie({ open, job, onOpenChange, onSubmit }: ModalProps) {
    const [form, setForm] = useState({ description: '', price: '' });

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }
    
    async function handleSubmit() {
      try {
        const applieResponse = await applieJob(job.id, form);
        console.log(applieResponse)
        toast.success(`Pedido criado com sucesso.`)
        onSubmit()
      } catch {
        toast.error("Não foi possivel criar o pedido.")
      }
    }

    useEffect(() => {
        if (!open) {
            setForm({ description: '', price: '' })
        }
    }, [open])

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--popover)] p-6 text-[var(--popover-foreground)] shadow-lg">
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-lg font-semibold">Candidatar ao pedido</Dialog.Title>
                <Dialog.Close className="cursor-pointer text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                  <X size={18} />
                </Dialog.Close>
              </div>

                <div className="mt-4 flex fles-wrap flex-col gap-4 items-start justify-between">
                    <MaskedInput label="Valor (R$)" variant="price" name="price" value={form.price} onChange={handleChange}/>

                    <Textarea
                        label="Descrição"
                        name="description"
                        placeholder="Descreva o serviço que você precisa"
                        value={form.description}
                        onChange={handleChange}
                    />

                  <MyButton theme="primary" className="w-full" onClick={handleSubmit}>Candidatar-se</MyButton>
                </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      );
}
