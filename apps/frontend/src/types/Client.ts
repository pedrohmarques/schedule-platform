export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    age: number;
    cpf: string;
    zipCode: string;
    street: string;
    number: string;
    complement: string | null;
    neighborhood: string;
    city: string;
    state: string;
    createdAt: string;
    updatedAt: string;
}