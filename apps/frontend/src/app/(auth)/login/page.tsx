'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginClient, loginProf } from '@/services/auth.services';
import MyButton from '@/components/ui/MyButton';
import Input from '@/components/ui/Input';
import { toast } from 'sonner';
import Link from 'next/link';
import { User, Briefcase, CalendarClock } from 'lucide-react';

type Role = 'client' | 'professional';

const activeRoleClass =
  'flex gap-2 items-center rounded-xl border px-3 py-3 text-sm font-medium transition-colors border-[var(--primary)] bg-[var(--secondary)] text-[var(--secondary-foreground)] cursor-pointer';
const inactiveRoleClass =
  'flex gap-2 items-center rounded-xl border px-3 py-3 text-sm font-medium transition-colors border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]/40 cursor-pointer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('client');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const login = role === 'client' ? loginClient : loginProf;
      const { access_token, profile } = await login(email, password);
      document.cookie = `token=${access_token}; path=/`;
      sessionStorage.setItem("user", JSON.stringify(profile))
      toast.success('Login realizado com sucesso!');
      router.push(`/dashboard/${role}`);
    } catch {
      toast.error('Email ou senha inválidos.');
    }
  }

  return (
    <div className="flex flex-col w-full max-w-sm">
        <div className="lg:hidden flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-3xl bg-[var(--primary)] text-[var(--primary-foreground)]">
            <CalendarClock size={18} />
          </span>
          
          <span className="font-display text-lg font-semibold tracking-tight">Horalis</span>
        </div>

        <h2 className="mt-8 text-2xl font-semibold lg:mt-0">Entrar na conta</h2>

        <p className="mt-2 text-sm text-[var(--muted-foreground)]">Escolha o tipo de acesso e continue o seu painel.</p>
        
        <div className="mt-6 grid grid-cols-2 gap-2">
            <button
                type="button"
                onClick={() => setRole('client')}
                className={role === 'client' ? activeRoleClass : inactiveRoleClass}
            >
              <User size={16}/>  Cliente
            </button>
            <button
                type="button"
                onClick={() => setRole('professional')}
                className={role === 'professional' ? activeRoleClass : inactiveRoleClass}
            >
              <Briefcase size={16}/>  Profissional
            </button>
        </div>

        <form onSubmit={handleSubmit} className='mt-6 space-y-4 flex flex-col flex-1'>
            <Input label="E-mail" name="email" type="email" placeholder="rafael@email.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <Input label="Senha" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <MyButton theme='primary'>Entrar</MyButton>
        </form>

        <span className="mt-6 text-sm text-[var(--muted-foreground)]">
            Ainda não tem conta? 
            <Link href="/create" className="font-medium text-[var(--primary)] underline-offset-4 hover:underline ml-2">
              Criar cadastro
            </Link>
        </span>
    </div>    
  );
}