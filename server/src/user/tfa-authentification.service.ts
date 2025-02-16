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
    TFA_ENCRYPTION_KEY,
    TFA_ISSUER,
    TFA_SECRET_TTL,
  } from 'shared/constants/tfa.constant';
  import { VerifyTfaDto } from './types/verify-tfa.dto';
  import { TfaState } from './types/tfa-state.enum';
  import { randomBytes , createCipheriv, createDecipheriv } from 'crypto';
import { SessionInterface } from 'shared/interfaces/session.interface';
  @Injectable()
  export class TfaAuthentificationService {

    //switch to store secret in database
    private readonly TFA_ENCRYPTION_KEY = TFA_ENCRYPTION_KEY
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
    private getChallengeCreationKey(challengeToken: string): string {
      return `tfa:challenge:${challengeToken}`;
    }
    private getChallengeCreationCounterKey(userId: string): string {
      return `tfa:challenge:creation:counter:${userId}`;
    }

    private getChallengeVerificationKey(challangeId: string): string {
      return `tfa:challenge:verification:${challangeId}`;
    }
    //enables and disables 2fa for the user
    async enableTfa(userId: string, token: string) {
      // check to see if the user is pending tfa activation
      const user = await this.userService.findOneById(userId);
      if (user.tfa_state != TfaState.PENDING) {
        throw new ConflictException('2FA is not pending for this user');
      }
      // verify the token
      /// fetch the secret from redis and verify the token
      const encryptedSecret = await this.redisService.GetKey(
        this.getTfaRedisSecretKey(userId),
      );
      console.log("encrypted" , encryptedSecret)
      const user_tfa_secret = this.decrypt(encryptedSecret)
      console.log(user_tfa_secret)
      /// check that the token is valid
      const is_valid = authenticator.verify({
        token,
        secret: user_tfa_secret,
      });
      if (!is_valid) {
        throw new ConflictException('Invalid 2FA code please try again');
      }
      // token is valid means user has successfully passed the initiate tfa verification process

      // change the user 2FA state to enabled
      await this.userService.changeTfaState(userId, TfaState.ENABLED);
      // change the user 2FA enabled state to true
      return true;
    }
    async disableTfa(userId: string) {
      // change the user 2FA state to false
      await this.userService.changeTfaState(userId, TfaState.DISABLED);

      // delete the 2FA secret and attempts key from redis if exists
      await this.redisService.DeleteKey(this.getTfaRedisSecretKey(userId));
      //await this.redisService.DeleteKey(this.getChallengeVerificationKey(userId));
      //await this.redisService.DeleteKey(this.getChallengeCreationKey(userId));

      return true;
    }
    async initiateTfaEnabling(userId: string) {
      const user = await this.userService.findOneById(userId);
      if (user.tfa_state == TfaState.ENABLED) {
        throw new ConflictException('User already have tfa enabled');
      }

      // nothing is wrong , generate a new secret for the user and return the qr code
      const { qr_code, secret, otp_uri } = await this.generateSecret(userId);
      await this.redisService.SetKey(this.getTfaRedisSecretKey(userId), this.encrypt(secret));
      await this.userService.changeTfaState(userId, TfaState.PENDING);
      return { qr_code, otp_uri };
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
        this.encrypt(secret),
        this.TFA_SECRET_TTL,
      );
      return {
        qr_code,
        secret,
        otp_uri,
      };
    }

    async verifyTfaToken(verifyTokenDto: VerifyTfaDto) : Promise<SessionInterface> {
      // decrypt the challange and get the user information 
      let challenge_token : string;
      try{
        challenge_token = this.decrypt(verifyTokenDto.challange)
      }
      catch(err){
        throw new ConflictException('Invalid challange token');
      }
      const userId = await this.redisService.GetKey(this.getChallengeCreationKey(challenge_token));
      console.log(userId, "chaleng" , challenge_token) 
      if(!userId){
        throw new ConflictException('Invalid challange token');
      }
      // check if the user has exceeded the verification attempts
      await this.checkChallengeVerifcationRateLimit(userId);
      // check if 2FA is enabled for the user
      const user = await this.userService.findOneById(userId);
      if (user.tfa_state != TfaState.ENABLED) {
        throw new ConflictException('2FA is not enabled for this user');
      }

      // get user 2FA secret
      const encryptedSecret = await this.redisService.GetKey(
        this.getTfaRedisSecretKey(userId),
      );
      const user_tfa_secret = this.decrypt(encryptedSecret)
      if (!user_tfa_secret) {
        throw new ConflictException('2FA secret not found , use other method and re-enable 2FA');
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
      await this.redisService.DeleteKey(this.getChallengeCreationKey(challenge_token));
      return {
        id : user.id,
        email : user.email,
        name : user.name,
      };
    }

    async generateTfaTokenChallenge(userId: string) {
      // check if the user has exceeded the creation attempts limit
      await this.checkChallengeCreationRateLimit(userId);
      // generate a challenge token
      const challenge_token = randomBytes(32).toString('hex');
      const encrypted_challange = this.encrypt(challenge_token)
      // save the challenge token in redis
      await this.redisService.SetKey(
        this.getChallengeCreationKey(challenge_token),
        userId,
        this.CHALLENGE_CREATION_WINDOW,
      );

      // Increment the creation attempts counter as this is an attempt to create a challange
      await this.incrementChallangeCreationAttempts(userId);

      // return the encrypted challange to the user
      return encrypted_challange;
    }

    private async checkChallengeCreationRateLimit(
      userId: string,
    ): Promise<boolean | void> {
      const attempts = await this.redisService.GetKey(
        this.getChallengeCreationCounterKey(userId),
      );
      if (attempts && parseInt(attempts) >= this.CHALLENGE_CREATION_LIMIT) {
        throw new ConflictException(
          `Too many verification attempts. Please try again in ${this.CHALLENGE_CREATION_WINDOW / 60} minutes.`,
        );
      }
      return true;
    }

    // this method is for all challanges that are created
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
      const key = this.getChallengeCreationCounterKey(userId);
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
    private encrypt(text: string): string {
        // Generate initialization vector
        const iv = randomBytes(12);
        
        // Create cipher
        const cipher = createCipheriv('aes-256-gcm', this.TFA_ENCRYPTION_KEY, iv);
        
        // Encrypt the text
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        // Get auth tag
        const authTag = cipher.getAuthTag();
        
        // Combine IV, encrypted text, and auth tag
        return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
    }
    private decrypt(encryptedData: string): string {
      // Split the encrypted data into components
      const [ivHex, encrypted, authTagHex] = encryptedData.split(':');
      
      // Convert hex strings back to buffers
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');
      
      // Create decipher
      const decipher = createDecipheriv('aes-256-gcm', this.TFA_ENCRYPTION_KEY, iv);
      decipher.setAuthTag(authTag);
      
      // Decrypt the text
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    }
  }
