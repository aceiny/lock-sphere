import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import {
  createGoogleUserDto,
  CreateUserDto,
} from 'src/user/types/create-user.dto';
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
import { AuthLogSourceEnum } from 'src/auth_log/type/auth-log.source.enum';
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
      const encryped_challange =
        await this.tfaAuthentificationService.generateTfaTokenChallenge(
          user.id,
        );
      throw new UnauthorizedException({
        message: 'Tfa required',
        challange: encryped_challange,
      });
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
  async validateUserWithGoogle(
    req : Request,
    user: createGoogleUserDto,
  ): Promise<SessionInterface> {
    const existingUser = await this.userService.findByEmail(user.email);
    if (existingUser) {
      await this.authLogService.createAuthLog(req , existingUser.id , AuthLogSourceEnum.GOOGLE);
      return {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
      };
    }
    const new_user = await this.userService.createWithGoogle(user);
    await this.authLogService.createAuthLog(req , new_user.id , AuthLogSourceEnum.GOOGLE);
    return {
      id: new_user.id,
      email: new_user.email,
      name: new_user.name,
    };
  }
  async verifyTfa(req : Request , verifyTfaDto: VerifyTfaDto): Promise<SessionInterface> {
    const user = await this.tfaAuthentificationService.verifyTfaToken(verifyTfaDto);
    await this.authLogService.createAuthLog(req , user.id , AuthLogSourceEnum.TFA);
    return user;
  }
  async signin(req: Request, user: SessionInterface): Promise<any> {
    await this.authLogService.createAuthLog(req , user.id , AuthLogSourceEnum.LOGIN);
    return true;
    /*await this.emailQueue.add(
      const mailDto: SendEmailOptions = {
        to: user.email,
        subject: 'New login to your lock sphere account',
        };
        "new-login",
        { mailDto },
        { attempts: 3, backoff: { type: "exponential", delay: 1000 } },
        );*/
  }
  async signup(req : Request , createUserDto: CreateUserDto): Promise<any> {
    const user = await this.userService.create(createUserDto);
    await this.authLogService.createAuthLog(req , user.id , AuthLogSourceEnum.REGISTER);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
  async signout(req: Request, res: Response): Promise<boolean> {
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
  async signSession(req: Request, user: SessionInterface): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      req.login(user, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }
  async checkUserValid(userId: string) {
    const user_obj = await this.userService.findOneById(userId);
    return true;
  }
  async passworMatch(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
