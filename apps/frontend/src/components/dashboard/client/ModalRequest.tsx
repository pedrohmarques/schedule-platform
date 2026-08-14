"use client";

import Input from "@/components/ui/Input";
import MaskedInput from "@/components/ui/MaskedInput";
import MyButton from "@/components/ui/MyButton";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { SERVICE_AREAS } from "@/constants/areas";
import { createJobRequest } from "@/services/job.service";
import { findByArea } from "@/services/professional.service";
import { Professional } from "@/types/Professional";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}

export default function ModalRequest({ open, onOpenChange, onSubmit }: ModalProps) {
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [form, setForm] = useState({ title: '', area: '', description: '', price: '', professionalId: '' });

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }
    
    async function handleSubmit() {
      try {
        const jobResponse = await createJobRequest(form);
        toast.success(`Pedido criado com sucesso.`)
        onSubmit()
      } catch {
        toast.error("Não foi possivel criar o pedido.")
      }
    }

    useEffect(() => {
        if(!form.area) {
            setProfessionals([])
            return;
        }
        findByArea(form.area).then(setProfessionals)
    }, [form.area])

    useEffect(() => {
        if (!open) {
            setForm({ title:'', area: '', description: '', price: '' , professionalId: '' })
        }
    }, [open])

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--popover)] p-6 text-[var(--popover-foreground)] shadow-lg">
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-lg font-semibold">Solicitar serviço</Dialog.Title>
                <Dialog.Close className="cursor-pointer text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                  <X size={18} />
                </Dialog.Close>
              </div>

                <div className="mt-4 flex fles-wrap flex-col gap-4 items-start justify-between">
                    <Input name="title" label="Titulo" value={form.title} onChange={handleChange}/>

                    <div className="grid gap-4 sm:grid-cols-2 w-full">
                        <Select
                            label="Área"
                            name="area"
                            value={form.area}
                            onChange={(value) => setForm((prev) => ({ ...prev, area: value }))}
                            options={[...SERVICE_AREAS]}
                        />

                        <Select
                            label="Profissional"
                            name="professionalId"
                            value={form.professionalId}
                            onChange={(value) => setForm((prev) => ({ ...prev, professionalId: value }))}
                            options={professionals.map((p) => ({ label: p.name, value: p.id }))}
                        />

                    </div>
                    <MaskedInput label="Valor (R$)" variant="price" name="price" value={form.price} onChange={handleChange}/>

                    <Textarea
                        label="Descrição"
                        name="description"
                        placeholder="Descreva o serviço que você precisa"
                        value={form.description}
                        onChange={handleChange}
                    />

                  <MyButton theme="primary" className="w-full" onClick={handleSubmit}>Solicitar</MyButton>
                </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      );
}
