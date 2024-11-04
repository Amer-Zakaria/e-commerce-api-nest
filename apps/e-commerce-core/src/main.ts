import { NestFactory } from '@nestjs/core';
import { ECommerceCoreModule } from './e-commerce-core.module';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './http-exception.filter';
import checkEnvs from './utils/check-envs';

async function bootstrap() {
  const app = await NestFactory.create(ECommerceCoreModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  const configService = app.get(ConfigService);

  await app.listen(configService.get('port', 3000));

  checkEnvs(configService);

  console.log(configService.get<string>('name'));
}
bootstrap();
