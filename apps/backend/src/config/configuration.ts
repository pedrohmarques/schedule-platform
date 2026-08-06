export interface AppConfig {
  nodeEnv: string;
  port: number;
  apiPrefix: string;
  corsOrigin: string[];
  databaseUrl: string;
}

/**
 * Factory de configuração usada pelo ConfigModule (@nestjs/config).
 * Centraliza a leitura de process.env em um único lugar tipado,
 * acessível via ConfigService.get<AppConfig>('app').
 */
export default (): { app: AppConfig } => ({
  app: {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '3001', 10),
    apiPrefix: process.env.API_PREFIX ?? 'api',
    corsOrigin: (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
      .split(',')
      .map((origin) => origin.trim()),
    databaseUrl: process.env.DATABASE_URL ?? '',
  },
});
