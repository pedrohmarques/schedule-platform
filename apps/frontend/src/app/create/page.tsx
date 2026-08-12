"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ClientForm from "./ClientForm";
import { useState } from "react";
import ProfissionalForm from "./ProfissionalForm";

type Role = 'client' | 'professional';

const activeRoleClass =
  'flex gap-2 items-center rounded-xl justify-center px-3 py-1 text-sm font-medium transition-colors bg-[var(--background)] text-[var(--foreground)] cursor-pointer shadow';
const inactiveRoleClass =
  'flex gap-2 items-center rounded-xl justify-center px-3 py-1 text-sm font-medium transition-colors text-[var(--muted-foreground)] cursor-pointer';

export default function CreateAccount() {
    const [role, setRole] = useState<Role>('client');
    
    return (
        <div className="min-h-screen bg-[var(--surface)]">
            <div className="mx-auto max-w-2xl px-6 py-12">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                    <ArrowLeft size={16}/> Voltar para o login
                </Link>
                <h2 className="mt-6 text-3xl font-semibold">Criar cadastro</h2>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">Escolha o tipo de conta. Cada perfil tem um painel próprio.</p>

                <div className="mt-6 grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => setRole('client')}
                        className={role === 'client' ? activeRoleClass : inactiveRoleClass}
                    >
                    Sou cliente
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('professional')}
                        className={role === 'professional' ? activeRoleClass : inactiveRoleClass}
                    >
                    Sou profissional
                    </button>
                </div>

                <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    { role === "client" ? <ClientForm /> : <ProfissionalForm />}                    
                </div>
            </div>
        </div>
        
    )
}