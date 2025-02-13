import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { UserService } from './user.service';
import { SessionInterface } from 'shared/interfaces/session.interface';
import { getEnvOrFatal } from 'common/utils/env.util';
import { TfaTokenDto } from 'src/vault/dto/tfa-token.dto';

@Injectable()
export class TfaAuthentificationService {
  constructor(
    private readonly userService: UserService,
  ) {}
  generateSecret(userEmail: string) {
    const secret = authenticator.generateSecret();
    const uri = authenticator.keyuri(userEmail, getEnvOrFatal("APP_NAME"), secret);

    return {
      uri,
      secret,
     };
  }
  verifyToken(input : TfaTokenDto): boolean {
    return authenticator.verify(input);
}

  async initiateTfaEnabling(user: SessionInterface) {
    const user_obj = await this.userService.findOneById(user.id);
    if (!user_obj.tfa_secret) {
      const { uri, secret } = this.generateSecret(user.email);
      await this.userService.changeTfaSecret(user_obj, secret);
    }

  }
  async enableTfa(userId: string) {
    return this.userService.changeTfaState(userId, true);
  }
  async disableTfa(userId: string) {
    return this.userService.changeTfaState(userId, false);
  }
  
}