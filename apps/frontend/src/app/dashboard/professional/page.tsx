"use client";

import { useEffect, useState } from "react";
import Tabs, { Tab } from "@/components/ui/Tab";
import Requests from "./Requests";

interface StoredUser {
    name: string;
    email: string;
}

export default function DashboardProfessional() {
    const [user, setUser] = useState<StoredUser | null>(null);

    useEffect(() => {
        const raw = sessionStorage.getItem("user");
        if (raw) {
            setUser(JSON.parse(raw));
        }
    }, []);

    return (
        <div className="min-h-screen bg-[var(--surface)]">
            <main className="mx-auto max-w-6xl px-6 pb-24 pt-10">
                <h1 className="text-3xl font-semibold">Olá, {user?.name}</h1>
                <p className="mt-2 max-w-2xl text-sm text-[var(--muted-foreground)]">Estes são os serviços que clientes solicitaram pra você. Aceite para confirmar na sua agenda ou recuse para liberar o horário.</p>


                <div className="mt-6">
                    <Tabs>
                        <Tab label="Pedidos">
                            <Requests />
                        </Tab>
                        <Tab label="Histórico">
                            <p className="">Histórico ficarma aqui.</p>
                        </Tab>
                        <Tab label="Vagas">
                            <p className="">Vagas ficarma aqui.</p>
                        </Tab>
                    </Tabs>
                </div>
            </main>
        </div>
    )
}
