import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { authenticator } from 'otplib';
import { UserService } from './user.service';
import { RedisService } from 'src/redis/redis.service';
import * as QRCode from 'qrcode';
import { QrCOdeConfig } from 'config/qr-code.config';
import {
  CHALLENGE_CREATION_LIMIT,
  CHALLENGE_CREATION_WINDOW,
  CHALLENGE_VERIFY_LIMIT,
  CHALLENGE_VERIFY_WINDOW,
  TFA_ISSUER,
  TFA_SECRET_TTL,
} from 'shared/constants/tfa.constant';
import { VerifyTfaDto } from './dto/verify-tfa.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class TfaAuthentificationService {
  /* to do :
  encrypt the secret key before saving it in redis  
  */
  private readonly TFA_ISSUER = TFA_ISSUER;
  private readonly TFA_SECRET_TTL = TFA_SECRET_TTL;
  private readonly CHALLENGE_CREATION_LIMIT = CHALLENGE_CREATION_LIMIT;
  private readonly CHALLENGE_CREATION_WINDOW = CHALLENGE_CREATION_WINDOW;
  private readonly CHALLENGE_VERIFY_LIMIT = CHALLENGE_VERIFY_LIMIT;
  private readonly CHALLENGE_VERIFY_WINDOW = CHALLENGE_VERIFY_WINDOW;

  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}
  private getTfaRedisSecretKey(userId: string): string {
    return `tfa:secret:${userId}`;
  }
  private getChallengeCreationKey(userId: string): string {
    return `tfa:challenge:creation:${userId}`;
  }

  private getChallengeVerificationKey(userId: string): string {
    return `tfa:challenge:verification:${userId}`;
  }
  //enables and disables 2fa for the user
  async enableTfa(userId: string) {
    // initiate the 2FA enabling process
    await this.initiateTfaEnabling(userId);
    // change the user 2FA enabled state to true
    await this.userService.changeTfaState(userId, true);
    return true;
  }
  async disableTfa(userId: string) {
    // change the user 2FA state to false
    await this.userService.changeTfaState(userId, false);

    // delete the 2FA secret and attempts key from redis if exists
    await this.redisService.DeleteKey(this.getTfaRedisSecretKey(userId));
    await this.redisService.DeleteKey(this.getChallengeVerificationKey(userId));
    await this.redisService.DeleteKey(this.getChallengeCreationKey(userId));

    return true;
  }
  async initiateTfaEnabling(userId: string) {
    // check if the user has already enabled 2FA and has a secret
    if (await this.redisService.GetKey(this.getTfaRedisSecretKey(userId))) { // maybe overwrite the secret
      throw new InternalServerErrorException(
        'User already has a 2FA secret , please disable and re-enable 2FA',
      );
    }

    // nothing is wrong , generate a new secret for the user and return the qr code
    const { qr_code, secret, otp_uri } = await this.generateSecret(userId);
    return { qr_code, secret, otp_uri };
  }
  async generateSecret(userId: string) {
    // generate a secret key for the user
    const secret = authenticator.generateSecret();

    // generate the otp uri
    const otp_uri = authenticator.keyuri(userId, this.TFA_ISSUER, secret);

    // generate qr code for the user to scan
    const qr_code = await QRCode.toDataURL(otp_uri, QrCOdeConfig);

    // save the secret key in redis
    await this.redisService.SetKey(
      this.getTfaRedisSecretKey(userId),
      secret,
      this.TFA_SECRET_TTL,
    );
    return {
      qr_code,
      secret,
      otp_uri,
    };
  }


  async verifyTfaToken(userId: string, verifyTokenDto: VerifyTfaDto) {
    // check if the user has exceeded the verification attempts
    await this.checkChallengeVerifcationRateLimit(userId);
    // check if 2FA is enabled for the user
    const user = await this.userService.findOneById(userId);
    if (!user.is_tfa_enabled) {
      throw new ConflictException('2FA is not enabled for this user');
    }

    // get user 2FA secret
    const user_tfa_secret = await this.redisService.GetKey(
      this.getTfaRedisSecretKey(userId),
    );
    if (!user_tfa_secret) {
      // Generate a new secret and ask the user to re-verify
      const { qr_code } = await this.generateSecret(userId);
      throw new ConflictException({
        message: '2FA secret expired or not found. Please re-scan the QR code.',
        qr_code,
      });
    }

    // verify the token using the secret
    const is_valid = authenticator.verify({
      token: verifyTokenDto.token,
      secret: user_tfa_secret,
    });

    if (!is_valid) {
      // increament challange attempts as this is a failed attempt
      await this.incrementChallangeVerificationAttempts(userId);
      throw new ConflictException('Invalid 2FA code');
    }

    // delete the attempts key as the user has successfully logged in
    await this.redisService.DeleteKey(this.getChallengeVerificationKey(userId));
    await this.redisService.DeleteKey(this.getChallengeCreationKey(userId));
    return true;
  }

  async generateMfaTokenChallenge(userId: string) {
    // check if the user has exceeded the creation attempts limit
    await this.checkChallengeCreationRateLimit(userId);
    // generate a challenge token
    const challenge_token = randomBytes(32).toString('hex');
    // save the challenge token in redis
    await this.redisService.SetKey(
      this.getChallengeCreationKey(userId),
      challenge_token,
      this.CHALLENGE_CREATION_WINDOW,
    );
      // Increment the creation attempts counter as this is an attempt
    await this.incrementChallangeCreationAttempts(userId);

    return challenge_token;
  }

  private async checkChallengeCreationRateLimit(
    userId: string,
  ): Promise<boolean | void> {
    const attempts = await this.redisService.GetKey(
      this.getChallengeCreationKey(userId),
    );
    if (attempts && parseInt(attempts) >= this.CHALLENGE_CREATION_LIMIT) {
      throw new ConflictException(
        `Too many verification attempts. Please try again in ${this.CHALLENGE_CREATION_WINDOW / 60} minutes.`,
      );
    }
    return true;
  }

  private async checkChallengeVerifcationRateLimit(
    userId: string,
  ): Promise<void> {
    const key = this.getChallengeVerificationKey(userId);
    const attempts = await this.redisService.GetKey(key);

    if (attempts && parseInt(attempts) >= this.CHALLENGE_VERIFY_LIMIT) {
      throw new ConflictException(
        `Too many verification attempts. Please try again in ${this.CHALLENGE_VERIFY_WINDOW / 60} minutes.`,
      );
    }
  }

  private async incrementChallangeCreationAttempts(
    userId: string,
  ): Promise<void> {
    const key = this.getChallengeCreationKey(userId);
    const attempts = await this.redisService.GetKey(key);

    if (!attempts) {
      await this.redisService.SetKey(key, '1', this.CHALLENGE_CREATION_WINDOW);
    } else {
      await this.redisService.IncrementKey(key);
    }
  }

  private async incrementChallangeVerificationAttempts(
    userId: string,
  ): Promise<void> {
    const key = this.getChallengeVerificationKey(userId);
    const attempts = await this.redisService.GetKey(key);

    if (!attempts) {
      await this.redisService.SetKey(key, '1', this.CHALLENGE_VERIFY_WINDOW);
    } else {
      await this.redisService.IncrementKey(key);
    }
  }
}
