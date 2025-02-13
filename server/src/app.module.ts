import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PostgresConfig } from 'config/postgres-config';
import { ThrottlerConfig } from 'config/throttler-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { MailModule } from './mail/mail.module';
import { QueueModule } from './queue/queue.module';
import { AuthLogModule } from './auth_log/auth_log.module';
import { CategoryModule } from './category/category.module';
import { VaultModule } from './vault/vault.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(PostgresConfig),
    ThrottlerModule.forRoot(ThrottlerConfig),
    UserModule,
    AuthModule,
    RedisModule,
    MailModule,
    QueueModule,
    AuthLogModule,
    CategoryModule,
    VaultModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
