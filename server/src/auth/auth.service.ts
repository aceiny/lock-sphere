import { BadRequestException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SendEmailOptions } from 'src/mail/interfaces/send-email.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectQueue("email-queue") private emailQueue: Queue,
  ) {}
  async validateUser(email: string, password: string): Promise<any> {
    console.log(email , password)
    email = email.trim().toLowerCase()
    const user = await this.userService.findByEmailWithPassword(email);
    if(!user) {
      throw new BadRequestException('Invalid credentials');
    }
    const passwordMatch: boolean = await this.passworMatch(
      password,
      user.password,
    );
    if (!passwordMatch) {
      throw new BadRequestException('Invalid credentials');
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
  async passworMatch(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
  async generateTokens(user: any) {
    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: 'access-secret-key',
      expiresIn: '15m', // Short-lived access token
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: 'refresh-secret-key',
      expiresIn: '7d', // Long-lived refresh token
    });


    return { accessToken, refreshToken };
  }

  async signin(): Promise<any> {
      const mailDto: SendEmailOptions = {
      to: "yzeraibi2000@gmail.com",
      subject: "New login to your lock sphere account",
    };
    await this.emailQueue.add(
      "new-login",
      { mailDto },
      { attempts: 3, backoff: { type: "exponential", delay: 1000 } },
    );
    return true
  }
  async signup(createUserDto : CreateUserDto): Promise<any> {
    return this.userService.create(createUserDto)
  }

  async logout(@Req() request: Request): Promise<any> {
    request.session.destroy(() => {
      return {
        message: 'Logout successful',
        statusCode: HttpStatus.OK,
      };
    });  }
}
