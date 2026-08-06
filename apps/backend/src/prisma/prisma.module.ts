import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Módulo global: importado uma vez no AppModule, o PrismaService fica
 * disponível para injeção em qualquer módulo da aplicação sem reimportar.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
