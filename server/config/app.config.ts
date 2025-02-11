import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SetupSwagger } from 'config/swagger.config';
import helmet from "helmet";
import { GlobalExceptionFilter } from 'common/filters/global-expection.filter';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { CorsConfig } from './cors-config';
import { ValidationPipeConfig } from './validation-pipe.config';

export async function CreateServer()  : Promise<INestApplication<any>>{
    const server = await NestFactory.create(AppModule);
    
    SetupSwagger(server);
    
    server.enableCors(CorsConfig);
    server.useGlobalPipes(
      new ValidationPipe(ValidationPipeConfig),
    );
    server.use(helmet());
    server.useGlobalFilters(new GlobalExceptionFilter());
    return server
}
