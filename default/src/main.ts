import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const serverConfig = config.get('server');
  const { port } = serverConfig;

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  await app.listen(port);
}
bootstrap();
