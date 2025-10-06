import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ApplicationExceptionFilter } from '~/common/exception/application-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  app.useGlobalFilters(new ApplicationExceptionFilter());

  await app.listen(3000);
}
bootstrap();
