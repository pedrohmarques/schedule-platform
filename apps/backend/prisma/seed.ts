import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  PrismaClient,
  RequestOrigin,
  RequestStatus,
  ServiceArea,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const PASSWORD_DEMO = 'demo12345';

const address = {
    zipCode: '01310100',
    street: 'Av. Paulista',
    neighborhood: 'Bela Vista',
    number: '56',
    city: 'São Paulo',
    state: 'SP',
};

function days(dias: number): Date {
    const d = new Date();
    d.setDate(d.getDate() - dias);
    return d;
}

async function createClient(data: {
    name: string;
    email: string;
    cpf: string;
    phone: string;
    birthDate: string;
}) {
    const user  = await prisma.user.upsert({
        where: { email: data.email },
        update: {},
        create: {
            name: data.name,
            email: data.email,
            password: await bcrypt.hash(PASSWORD_DEMO, 10),
            phone: data.phone,
            birthDate: new Date(data.birthDate),
            cpf: data.cpf,
            ...address,
            clientProfile: { create: {} }
        },
        include: { clientProfile: true }
    })

    return user.clientProfile!.id;
}

async function createProfessional(data: {
    name: string;
    email: string;
    cpf: string;
    phone: string;
    area: ServiceArea;
    birthDate: string;
    description: string;
}) {
    const user  = await prisma.user.upsert({
        where: { email: data.email },
        update: {},
        create: {
            name: data.name,
            email: data.email,
            password: await bcrypt.hash(PASSWORD_DEMO, 10),
            phone: data.phone,
            birthDate: new Date(data.birthDate),
            cpf: data.cpf,
            ...address,
            // area e description são colunas de ProfessionalProfile, não de User
            professionalProfile: {
                create: { area: data.area, description: data.description }
            }
        },
        include: { professionalProfile: true }
    })

    return user.professionalProfile!.id;
}

async function main() {
    await prisma.jobRequest.deleteMany();
    await prisma.job.deleteMany();

    // ---------- clientes ----------
  const ana = await createClient({
    name: 'Ana Souza',
    email: 'cliente@horalis.dev',
    cpf: '11144477735',
    phone: '11988880000',
    birthDate: '1992-04-18',
  });

  const carla = await createClient({
    name: 'Carla Nunes',
    email: 'carla@horalis.dev',
    cpf: '52998224725',
    phone: '11988880000',
    birthDate: '1988-11-02',
  });

  // ---------- profissionais ----------
  const bruno = await createProfessional({
    name: 'Bruno Barbosa',
    email: 'profissional@horalis.dev',
    cpf: '39053344705',
    phone: '11988880000',
    birthDate: '1990-05-14',
    area: ServiceArea.BARBEARIA,
    description: 'Barbeiro há 8 anos. Corte, barba e atendimento em domicílio.',
  });

  const diego = await createProfessional({
    name: 'Diego Martins',
    email: 'diego@horalis.dev',
    cpf: '16899535009',
    phone: '11988880000',
    birthDate: '1995-01-30',
    area: ServiceArea.BARBEARIA,
    description: 'Especialista em degradê e barba desenhada.',
  });

  const elisa = await createProfessional({
    name: 'Elisa Prado',
    email: 'elisa@horalis.dev',
    cpf: '64066570080',
    birthDate: '1993-07-22',
    phone: '11988880000',
    area: ServiceArea.BARBEARIA,
    description: 'Cortes masculinos clássicos e modernos.',
  });

  const fernanda = await createProfessional({
    name: 'Fernanda Lima',
    email: 'fernanda@horalis.dev',
    cpf: '98765432100',
    birthDate: '1987-03-09',
    phone: '11988880000',
    area: ServiceArea.CABELEIREIRO,
    description: 'Coloração, escova e tratamentos capilares.',
  });

  const gabriel = await createProfessional({
    name: 'Gabriel Rocha',
    email: 'gabriel@horalis.dev',
    cpf: '12345678909',
    phone: '11988880000',
    birthDate: '1996-09-11',
    area: ServiceArea.MANICURE_PEDICURE,
    description: 'Manicure e pedicure com esmaltação em gel.',
  });

  const helena = await createProfessional({
    name: 'Helena Dias',
    email: 'helena@horalis.dev',
    cpf: '74658925050',
    birthDate: '1985-12-05',
    phone: '11988880000',
    area: ServiceArea.MASSOTERAPIA,
    description: 'Massagem relaxante, drenagem e liberação miofascial.',
  });

  // ---------- jobs ---------
  // 1. OPEN sem candidatos -> aparece na aba "Vagas" do Bruno
  await prisma.job.create({
    data: {
      clientId: ana,
      area: ServiceArea.BARBEARIA,
      title: 'Corte e barba em casa',
      description: 'Preciso de corte social e barba, atendimento no meu endereço.',
      price: 90,
      status: 'OPEN',
      createdAt: days(1),
    },
  });

  // 2. OPEN com 3 candidaturas -> alimenta o botão "Ver candidatos"
  await prisma.job.create({
    data: {
      clientId: ana,
      area: ServiceArea.BARBEARIA,
      title: 'Corte para casamento',
      description: 'Casamento no sábado, preciso de corte e barba caprichados.',
      price: 150,
      status: 'OPEN',
      createdAt: days(2),
      requests: {
        create: [
          {
            professionalId: diego,
            price: 150,
            description: 'Posso atender no sábado de manhã, com produtos inclusos.',
            status: RequestStatus.PENDING,
            origin: RequestOrigin.PROFESSIONAL_APPLICATION,
          },
          {
            professionalId: elisa,
            price: 170,
            description: 'Atendo em domicílio e levo cadeira própria.',
            status: RequestStatus.PENDING,
            origin: RequestOrigin.PROFESSIONAL_APPLICATION,
          },
          {
            professionalId: bruno,
            price: 140,
            description: 'Tenho horário no sábado às 9h.',
            status: RequestStatus.PENDING,
            origin: RequestOrigin.PROFESSIONAL_APPLICATION,
          },
        ],
      },
    },
  });

  // 3. PENDING -> convite direto aguardando resposta do Bruno ("Pedidos")
  await prisma.job.create({
    data: {
      clientId: carla,
      area: ServiceArea.BARBEARIA,
      title: 'Barba semanal',
      description: 'Manutenção de barba toda sexta-feira.',
      price: 60,
      status: 'PENDING',
      createdAt: days(3),
      requests: {
        create: {
          professionalId: bruno,
          price: 60,
          description: 'Manutenção de barba toda sexta-feira.',
          status: RequestStatus.PENDING,
          origin: RequestOrigin.CLIENT_INVITE,
        },
      },
    },
  });

  // 4. ACCEPTED -> mostra o botão de concluir no dashboard do cliente
  await prisma.job.create({
    data: {
      clientId: ana,
      area: ServiceArea.BARBEARIA,
      title: 'Corte mensal',
      description: 'Corte social, sempre na primeira semana do mês.',
      price: 80,
      status: 'ACCEPTED',
      createdAt: days(5),
      requests: {
        create: {
          professionalId: bruno,
          price: 80,
          description: 'Corte social, sempre na primeira semana do mês.',
          status: RequestStatus.ACCEPTED,
          origin: RequestOrigin.CLIENT_INVITE,
        },
      },
    },
  });

  // 5. COMPLETED -> histórico dos dois lados
  await prisma.job.create({
    data: {
      clientId: ana,
      area: ServiceArea.MASSOTERAPIA,
      title: 'Massagem relaxante',
      description: 'Sessão de 60 minutos para dor nas costas.',
      price: 180,
      status: 'COMPLETED',
      createdAt: days(12),
      requests: {
        create: {
          professionalId: helena,
          price: 180,
          description: 'Sessão de 60 minutos, levo maca própria.',
          status: RequestStatus.COMPLETED,
          origin: RequestOrigin.CLIENT_INVITE,
        },
      },
    },
  });

  // 6. COMPLETED do Bruno -> aba "Histórico" dele
  await prisma.job.create({
    data: {
      clientId: carla,
      area: ServiceArea.BARBEARIA,
      title: 'Corte antes da viagem',
      description: 'Corte rápido, máquina 2 nas laterais.',
      price: 70,
      status: 'COMPLETED',
      createdAt: days(20),
      requests: {
        create: {
          professionalId: bruno,
          price: 70,
          description: 'Corte rápido, máquina 2 nas laterais.',
          status: RequestStatus.COMPLETED,
          origin: RequestOrigin.CLIENT_INVITE,
        },
      },
    },
  });

  // 7. Candidatura recusada -> completa o histórico do Bruno
  await prisma.job.create({
    data: {
      clientId: carla,
      area: ServiceArea.BARBEARIA,
      title: 'Corte infantil',
      description: 'Meu filho de 6 anos, precisa de paciência.',
      price: 50,
      status: 'ACCEPTED',
      createdAt: days(9),
      requests: {
        create: [
          {
            professionalId: bruno,
            price: 55,
            description: 'Atendo crianças, tenho brinquedos para distrair.',
            status: RequestStatus.REJECTED,
            origin: RequestOrigin.PROFESSIONAL_APPLICATION,
          },
          {
            professionalId: elisa,
            price: 50,
            description: 'Trabalho bastante com público infantil.',
            status: RequestStatus.ACCEPTED,
            origin: RequestOrigin.PROFESSIONAL_APPLICATION,
          },
        ],
      },
    },
  });

  // 8. Outras áreas -> dão conteúdo ao select do modal de solicitar serviço
  await prisma.job.create({
    data: {
      clientId: ana,
      area: ServiceArea.CABELEIREIRO,
      title: 'Escova progressiva',
      description: 'Cabelo abaixo do ombro, quero reduzir o volume.',
      price: 250,
      status: 'PENDING',
      createdAt: days(4),
      requests: {
        create: {
          professionalId: fernanda,
          price: 250,
          description: 'Cabelo abaixo do ombro, quero reduzir o volume.',
          status: RequestStatus.PENDING,
          origin: RequestOrigin.CLIENT_INVITE,
        },
      },
    },
  });

  await prisma.job.create({
    data: {
      clientId: carla,
      area: ServiceArea.MANICURE_PEDICURE,
      title: 'Manicure e pedicure',
      description: 'Esmaltação em gel, cor a combinar.',
      price: 120,
      status: 'COMPLETED',
      createdAt: days(15),
      requests: {
        create: {
          professionalId: gabriel,
          price: 120,
          description: 'Esmaltação em gel, levo o kit completo.',
          status: RequestStatus.COMPLETED,
          origin: RequestOrigin.CLIENT_INVITE,
        },
      },
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });