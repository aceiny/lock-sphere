import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SetupSwagger } from 'config/swagger.config';
import helmet from 'helmet';
import { GlobalExceptionFilter } from 'common/filters/global-expection.filter';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { ValidationPipeConfig } from 'config/validation-pipe.config';
import { CorsConfig } from 'config/cors-config';
import * as session from 'express-session';
import * as passport from 'passport';
import { SessionConfig } from 'config/session.config';
import { RedisStore } from 'connect-redis';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { CsrfMiddleware } from 'common/middlewares/csrf.middleware';

export async function CreateServer(): Promise<NestExpressApplication> {
  const server = await NestFactory.create<NestExpressApplication>(AppModule);
  SetupSwagger(server);
  server.use(cookieParser());
  const redisClient = server.get('REDIS_CLIENT');
  server.use(
    session({
      store: new RedisStore({ client: redisClient, prefix: 'ssid:' }),
      ...SessionConfig,
    }),
  );
  server.use(passport.initialize());
  server.use(passport.session());
  server.enableCors(CorsConfig);
  server.useGlobalPipes(new ValidationPipe(ValidationPipeConfig));
  server.use(helmet());
  server.useGlobalFilters(new GlobalExceptionFilter());
  return server;
}
