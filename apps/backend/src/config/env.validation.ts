import { Type, plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT = 3001;

  @IsString()
  @IsNotEmpty()
  API_PREFIX = 'api';

  @IsString()
  @IsNotEmpty()
  CORS_ORIGIN = 'http://localhost:3000';

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;
}

/**
 * Valida as variáveis de ambiente na inicialização da aplicação.
 * Se alguma variável obrigatória estiver ausente ou inválida, a aplicação
 * falha imediatamente ao subir, em vez de falhar silenciosamente em runtime.
 */
export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(`Configuração de ambiente inválida:\n${errors.toString()}`);
  }

  return validatedConfig;
}
