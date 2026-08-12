"use client"
import CpfInput from "@/components/ui/CpfInput";
import Input from "@/components/ui/Input"
import MaskedInput from "@/components/ui/MaskedInput";
import Select from "@/components/ui/Select";
import MyButton from "@/components/ui/MyButton";
import { createClient } from "@/services/create.service";
import { useCepLookup } from "@/hooks/useCepLookup";
import { BRAZILIAN_STATES } from "@/constants/states";
import { combine, isEmail, minLength, required } from "@/lib/validators";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const validateName = required("Informe seu nome completo");
const validateEmail = combine(required(), isEmail());
const validatePassword = combine(required(), minLength(6));
const validateAge = required("Informe sua idade");
const validateNeighborhood = required("Informe o bairro");
const validateStreet = required("Informe a rua");
const validateNumber = required("Informe o número");
const validateCity = required("Informe a cidade");
const validateState = required("Selecione o estado");

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
    const [submitted, setSubmitted] = useState(false);

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

    function isFormValid() {
        return (
            !validateName(name) &&
            !validateEmail(email) &&
            !validatePassword(password) &&
            !validateAge(age) &&
            !validateNeighborhood(neighborhood) &&
            !validateStreet(street) &&
            !validateNumber(number) &&
            !validateCity(city) &&
            !validateState(state)
        );
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!isFormValid()) {
            setSubmitted(true);
            toast.error("Preencha todos os campos corretamente.");
            return;
        }

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
                <Input
                    label="Nome completo"
                    name="name"
                    type="text"
                    placeholder="Pedro Almeida"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    validate={validateName}
                    forceShow={submitted}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                        label="E-mail"
                        name="email"
                        type="email"
                        placeholder="rafael@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        validate={validateEmail}
                        forceShow={submitted}
                    />
                    <Input
                        label="Senha"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        validate={validatePassword}
                        forceShow={submitted}
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <MaskedInput
                        label="Telefone"
                        name="phone"
                        variant="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        forceShow={submitted}
                    />
                    <CpfInput
                        label="CPF"
                        name="cpf"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        forceShow={submitted}
                    />
                </div>
                <Input
                    label="Idade"
                    name="age"
                    type="number"
                    placeholder="30"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    validate={validateAge}
                    forceShow={submitted}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <MaskedInput
                        label="CEP"
                        name="cep"
                        variant="cep"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        forceShow={submitted}
                    />
                    <Input
                        label="Bairro"
                        name="neighborhood"
                        type="text"
                        placeholder="Bela Vista"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        validate={validateNeighborhood}
                        forceShow={submitted}
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                        label="Rua"
                        name="street"
                        type="text"
                        placeholder="Av Paulista"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        validate={validateStreet}
                        forceShow={submitted}
                    />
                    <Input
                        label="Número"
                        name="number"
                        type="text"
                        placeholder="1000"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        validate={validateNumber}
                        forceShow={submitted}
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                        label="Cidade"
                        name="city"
                        type="text"
                        placeholder="São Paulo"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        validate={validateCity}
                        forceShow={submitted}
                    />
                    <Select
                        label="Estado"
                        name="state"
                        value={state}
                        onChange={(value) => setState(value)}
                        options={[...BRAZILIAN_STATES]}
                    />
                </div>

                <Input
                    label="Complemento"
                    name="complement"
                    type="text"
                    placeholder="Apto 101 (opcional)"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                />

                <MyButton theme="primary">Criar conta</MyButton>
            </form>
        </div>
    )
}
