import { CalendarClock } from "lucide-react";
import LoginPage from "./(auth)/login/page";

export default function Home() {
  return (
    <div className="flex flex-1 font-sans bg-[var(--background)]">
      <div className="hidden flex flex-col flex-1 justify-between font-sans bg-[var(--primary)] py-12 px-12 lg:flex">
          <span className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-[var(--primary-foreground)]">
            <CalendarClock size={24}/> Horalis
          </span>
          <div className=" flex flex-1 flex-col justify-center font-sans max-w-md">
            <p className="text-4xl font-semibold leading-tight text-[var(--primary-foreground)]">
              Agenda organizada, acordos claros.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--primary-foreground)]/80">
              Clientes propõem serviço, valor e horário. Profissionais aceitam ou recusam em um clique. Sem mensagens perdidas, sem confusão de horário.
            </p>
          </div>
      </div>

      <div className="flex flex-1 justify-center items-center font-sans bg-[var(--background)] px-6 py-12">
        <LoginPage />
      </div>
    </div>
  );
}
