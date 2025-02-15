import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { createGoogleUserDto, CreateUserDto } from 'src/user/types/create-user.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SendEmailOptions } from 'src/mail/interfaces/send-email.interface';
import { getEnvOrFatal } from 'common/utils/env.util';
import { SessionInterface } from 'shared/interfaces/session.interface';
import { AuthLogService } from 'src/auth_log/auth_log.service';
import { AuthLogStatusEnum } from 'src/auth_log/type/auth-log.status.enum';
import * as geoip from 'geoip-lite';
import { TfaAuthentificationService } from 'src/user/tfa-authentification.service';
import { VerifyTfaDto } from 'src/user/types/verify-tfa.dto';
import { TfaState } from 'src/user/types/tfa-state.enum';
import { GoogleUser } from './types/google-user.interface';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tfaAuthentificationService: TfaAuthentificationService,
    private readonly authLogService: AuthLogService,
    @InjectQueue('email-queue') private emailQueue: Queue,
  ) {}
    async validateUser(
      email: string,
      password: string,
    ): Promise<SessionInterface> {
      console.log(email, password);
      email = email.trim().toLowerCase();
      const user = await this.userService.findByEmailWithPassword(email);
      if (!user) {
        throw new BadRequestException('Invalid credentials');
      }
      const passwordMatch: boolean = await this.passworMatch(
        password,
        user.password,
      );
      if (!passwordMatch) {
        throw new BadRequestException('Invalid credentials');
      }
      if (user.tfa_state == TfaState.ENABLED) {
        const encryped_challange = await this.tfaAuthentificationService.generateTfaTokenChallenge(user.id);
        throw new UnauthorizedException({
          message: "Tfa required",
          challange: encryped_challange,
        });
      }
      return {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    }
    async validateUserWithGoogle(user: createGoogleUserDto): Promise<SessionInterface> {
      const existingUser = await this.userService.findByEmail(user.email);
      if (existingUser) {
        return {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
        };
      }
      const new_user = await this.userService.createWithGoogle(user)
      return {
        id: new_user.id,
        email: new_user.email,
        name: new_user.name,
      };
    }
  
  async verifyTfa(verifyTfaDto: VerifyTfaDto): Promise<boolean> {
    const user = await this.tfaAuthentificationService.verifyTfaToken(verifyTfaDto)
    return true
  }
  async signin(req: Request, user: SessionInterface): Promise<any> {
    const mailDto: SendEmailOptions = {
      to: user.email,
      subject: 'New login to your lock sphere account',
    };
    const location = geoip.lookup(req.ip);
    Logger.log(location);
    await this.authLogService.createAuthLog(user.id, {
      ip_address: req.ip,
      user_agent: req.headers['user-agent'] || 'Unknown',
      status: AuthLogStatusEnum.SUCCESS,
    });
    /*await this.emailQueue.add(
      "new-login",
      { mailDto },
      { attempts: 3, backoff: { type: "exponential", delay: 1000 } },
      );*/
    return true;
  }
  async signup(createUserDto: CreateUserDto): Promise<any> {
    return this.userService.create(createUserDto);
  }
  async signout(req: Request , res : Response): Promise<boolean> {
    if (!req.session?.passport) {
      throw new UnauthorizedException('Session not found');
    }

    req.session.destroy((err) => {
      if (err) {
        throw new Error();
      }
    });
    res.clearCookie(getEnvOrFatal('COOKIE_NAME'));
    return true;
  }
  async passworMatch(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
