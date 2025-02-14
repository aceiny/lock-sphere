import { ConflictException, Injectable } from '@nestjs/common';
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
  private getTfaRedisKey(userId: string): string {
    return `tfa:${userId}`;
  }
  private getChallengeCreationKey(userId: string): string {
    return `tfa:challenge:creation:${userId}`;
  }

  private getChallengeVerificationKey(userId: string): string {
    return `tfa:challenge:verification:${userId}`;
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
      this.getTfaRedisKey(userId),
      secret,
      this.TFA_SECRET_TTL,
    );
    return {
      qr_code,
      secret,
      otp_uri,
    };
  }

  async initiateTfaEnabling(userId: string) {
    // check if the user has already enabled 2FA and has a secret
    const user = await this.userService.findOneById(userId);
    if (
      !(await this.redisService.GetKey(`tfa:${userId}`)) &&
      user.is_tfa_enabled
    ) {
      const { qr_code, secret } = await this.generateSecret(userId);
      return { qr_code, secret };
    }
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
      this.getTfaRedisKey(userId),
    );
    if (!user_tfa_secret) {
      // Generate a new secret and ask the user to re-verify
      const { qr_code, secret } = await this.generateSecret(userId);
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

  // creates a new tfa challenge for the user for exmaple a user login and logout then relogin this means two new challenges has been created
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

  // create a new tfa challenge solving attempt for the user , exmaple a user login and submit the 2fa if it is wrong he then try  to resubmit the code on same 2fa this means two new challenges has been created
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
  async generateMfaTokenChallenge(userId: string) {
    // no need to check if 2FA is enabled as this function will be called inside the login function
    // generate a challenge token
    const challenge_token = randomBytes(32).toString('hex');
  }

  //enables and disables 2fa for the user
  async enableTfa(userId: string) {
    // change the user 2FA state to true
    await this.userService.changeTfaState(userId, true);

    // initiate the 2FA enabling process
    await this.initiateTfaEnabling(userId);
    return true;
  }
  async disableTfa(userId: string) {
    // change the user 2FA state to false
    await this.userService.changeTfaState(userId, false);

    // delete the 2FA secret and attempts key from redis
    await this.redisService.DeleteKey(this.getTfaRedisKey(userId));
    await this.redisService.DeleteKey(this.getChallengeVerificationKey(userId));
    return true;
  }
}
