import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportConfig } from 'config/passport.config';
import { Session } from './serializer/session.serializer';
import { QueueModule } from 'src/queue/queue.module';
import { AuthLogModule } from 'src/auth_log/auth_log.module';
import { CategoryModule } from 'src/category/category.module';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    PassportModule.register(PassportConfig),
    UserModule,
    QueueModule,
    AuthLogModule,
    CategoryModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, GoogleStrategy , Session],
})
export class AuthModule {}
