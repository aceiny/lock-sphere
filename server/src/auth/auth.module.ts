import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { PassportConfig } from 'config/passport.config';
import { Session } from './serializer/session.serializer';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [
    PassportModule.register(PassportConfig),
    JwtModule.register({}),
    UserModule,
    QueueModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    Session,
  ],
})
export class AuthModule {}
