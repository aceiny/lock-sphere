import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SetupSwagger } from 'config/swagger.config';
import helmet from "helmet";
import { GlobalExceptionFilter } from 'common/filters/global-expection.filter';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { ValidationPipeConfig } from 'config/validation-pipe.config';
import { CorsConfig } from 'config/cors-config';
import * as session from 'express-session';
import * as passport from 'passport';
import { SessionConfig } from 'config/session.config';

export async function CreateServer()  : Promise<INestApplication<any>>{
    const server = await NestFactory.create(AppModule);
    
    SetupSwagger(server);
    
    server.use(session(SessionConfig))
    server.use(passport.initialize());
    server.use(passport.session());
    server.enableCors(CorsConfig);
    server.useGlobalPipes(
      new ValidationPipe(ValidationPipeConfig),
    );
    server.use(helmet());
    server.useGlobalFilters(new GlobalExceptionFilter());
    return server
}
