import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    PassportModule.register({session : true}),
    JwtModule.register({}),  
      UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService  , LocalStrategy , AccessTokenStrategy , RefreshTokenStrategy],
})
export class AuthModule {}
