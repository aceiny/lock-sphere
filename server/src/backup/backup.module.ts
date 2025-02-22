import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BackupService } from './backup.service';
import { BackupController } from './backup.controller';
import { UserModule } from 'src/user/user.module';
import { AuthLogModule } from 'src/auth_log/auth_log.module';
import { VaultModule } from 'src/vault/vault.module';
import { CategoryModule } from 'src/category/category.module';
import { SessionMiddleware } from 'common/middlewares/session.middleware';

@Module({
  imports : [
    UserModule,
    AuthLogModule,
    VaultModule,
    CategoryModule,
  ],
  controllers: [BackupController],
  providers: [BackupService],
})
export class BackupModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes(BackupController);
  }
}