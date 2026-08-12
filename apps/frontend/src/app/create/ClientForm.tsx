"use client"
import CpfInput from "@/components/ui/CpfInput";
import Input from "@/components/ui/Input"
import MaskedInput from "@/components/ui/MaskedInput";
import MyButton from "@/components/ui/MyButton";
import { createClient } from "@/services/create.service";
import { useCepLookup } from "@/hooks/useCepLookup";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ClientForm() {
    const router = useRouter()
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpf, setCpf] = useState('');
    const [age, setAge] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [phone, setPhone] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [complement, setComplement] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');

    const { address, error: cepError } = useCepLookup(zipCode);

    useEffect(() => {
        if (!address) return;
        setStreet(address.street);
        setNeighborhood(address.neighborhood);
        setCity(address.city);
        setState(address.state);
    }, [address]);

    useEffect(() => {
        if (cepError) toast.error(cepError);
    }, [cepError]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const data = {
                name,
                email,
                password,
                cpf,
                age: Number(age),
                phone,
                zipCode,
                street,
                number,
                complement,
                neighborhood,
                city,
                state
            }
            const res = await createClient(data);
            console.log(res)
            toast.success("Conta criada com sucesso.")
            router.push("/")
        } catch {
            toast.error("Dados invalidos.")
        }
    }

    return (
        <div className="mt-4 space-y-4 p-6 bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius)]">
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-4">
                <Input label="Nome completo" name="name" type="text" placeholder="Pedro Almeida" value={name} onChange={(e) => setName(e.target.value)}/>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="E-mail" name="email" type="email" placeholder="rafael@email.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <Input label="Senha" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />                                        
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <MaskedInput label="Telefone" name="phone" variant="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    <CpfInput label="CPF" name="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} />
                </div>
                <Input label="Idade" name="age" type="number" placeholder="30" value={age} onChange={(e) => setAge(e.target.value)} />

                <div className="grid gap-4 sm:grid-cols-2">
                    <MaskedInput label="CEP" name="cep" variant="cep" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                    <Input label="Bairro" name="neighborhood" type="text" placeholder="Bela Vista" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Rua" name="street" type="text" placeholder="Av Paulista" value={street} onChange={(e) => setStreet(e.target.value)} />
                    <Input label="Número" name="number" type="text" placeholder="1000" value={number} onChange={(e) => setNumber(e.target.value)} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Cidade" name="city" type="text" placeholder="São Paulo" value={city} onChange={(e) => setCity(e.target.value)} />
                    <Input label="Estado" name="state" type="text" placeholder="SP" value={state} onChange={(e) => setState(e.target.value)} />
                </div>

                <Input label="Complemento" name="complement" type="text" placeholder="Apto 101" value={complement} onChange={(e) => setComplement(e.target.value)} />

                <MyButton theme="primary">Criar conta</MyButton>
            </form>
        </div>
    )
}