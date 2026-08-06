# Schedule Platform

Monorepo com **frontend** (Next.js) e **backend** (NestJS), estruturados como
aplicações independentes para permitir deploy separado (ex.: frontend na
Vercel, backend em um serviço de containers/Node).

## Estrutura

```
schedule-platform/
├── apps/
│   ├── frontend/          # Next.js (App Router, TypeScript, Tailwind)
│   │   └── src/
│   │       ├── app/         # Rotas (App Router)
│   │       ├── components/  # Componentes React (ui/ para primitivos)
│   │       ├── hooks/       # Hooks customizados
│   │       ├── lib/         # Clientes/utilitários (ex.: api.ts)
│   │       ├── types/       # Tipos compartilhados
│   │       └── constants/   # Constantes globais
│   │
│   └── backend/           # NestJS (TypeScript, Prisma, PostgreSQL)
│       ├── prisma/          # schema.prisma e migrations
│       └── src/
│           ├── common/       # filters, interceptors, guards, pipes globais
│           ├── config/       # configuração e validação de env vars
│           ├── prisma/       # PrismaService/PrismaModule (acesso ao banco)
│           └── modules/      # módulos de domínio (health, e futuros: auth, users...)
│
├── docker-compose.yml      # PostgreSQL para desenvolvimento local
└── README.md
```

Cada app tem seu próprio `package.json` e é independente — não há workspace
compartilhado entre eles, propositalmente, para que cada um possa ser
implantado (build/deploy) isoladamente no futuro.

## Pré-requisitos

- Node.js 20+
- Docker (para rodar o PostgreSQL localmente) — opcional se você já tiver um Postgres

## Como rodar

### 1. Banco de dados

```bash
docker compose up -d
```

Sobe um PostgreSQL em `localhost:5432` (usuário/senha/banco: `postgres` /
`postgres` / `schedule_platform`), já compatível com o `.env` padrão do backend.

### 2. Backend (NestJS) — porta 3001

```bash
cd apps/backend
npm install
npm run prisma:migrate   # cria/atualiza as tabelas a partir do prisma/schema.prisma
npm run start:dev
```

- API: `http://localhost:3001/api`
- Swagger: `http://localhost:3001/api/docs` (apenas fora de produção)
- Health check: `http://localhost:3001/api/health` e `/api/health/db`

Configuração em `apps/backend/.env` (veja `.env.example`).

### 3. Frontend (Next.js) — porta 3000

```bash
cd apps/frontend
npm install
cp .env.local.example .env.local
npm run dev
```

- App: `http://localhost:3000`

## Backend — o que já vem pré-configurado

- **Config validada**: variáveis de ambiente tipadas e validadas na
  inicialização (`src/config`), via `@nestjs/config` + `class-validator`.
- **Prisma + PostgreSQL**: `PrismaService` global, conectado/desconectado
  junto ao ciclo de vida da aplicação (`src/prisma`), usando o driver adapter
  `@prisma/adapter-pg`.
- **Validação global**: `ValidationPipe` (whitelist + transform) aplicado a
  toda a API.
- **CORS**: liberado para a URL do frontend (`CORS_ORIGIN` no `.env`).
- **Segurança básica**: `helmet` habilitado.
- **Tratamento de erros**: filtro global de exceções com resposta padronizada.
- **Logging**: interceptor global logando método, rota e tempo de resposta.
- **Swagger**: documentação automática em `/api/docs` (ambiente não-produção).
- **Health checks**: `/api/health` (liveness) e `/api/health/db` (conectividade
  com o banco).
- **Prefixo global de API**: todas as rotas sob `/api`.

Para adicionar um novo domínio (ex.: `agendamentos`), crie um módulo em
`src/modules/agendamentos` e registre-o em `src/app.module.ts`.
