import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { AppConfig } from '../config/configuration';

/**
 * Encapsula o PrismaClient como um provider do Nest, conectando ao banco
 * (via driver adapter do node-postgres) na inicialização do módulo e
 * desconectando de forma limpa no shutdown.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(configService: ConfigService) {
    const { databaseUrl } = configService.get<AppConfig>('app')!;
    super({ adapter: new PrismaPg({ connectionString: databaseUrl }) });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Conectado ao banco de dados');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
