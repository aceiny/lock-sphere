import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthLogService } from './auth_log.service';
import { AuthLogController } from './auth_log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthLog } from './entities/auth_log.entity';
import { SessionMiddleware } from 'common/middlewares/session.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([AuthLog])],
  controllers: [AuthLogController],
  providers: [AuthLogService],
  exports: [AuthLogService],
})
export class AuthLogModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes(AuthLogController);
  }
}
{
}
