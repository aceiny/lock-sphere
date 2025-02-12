import { BadRequestException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string): Promise<any> {
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
    return {
      message: 'Login successful',
      statusCode: HttpStatus.OK,
    };
  }
  async signup(createUserDto : CreateUserDto): Promise<any> {
    return this.userService.create(createUserDto)
  }

  async logout(@Req() request: Request): Promise<any> {
    return 'true'  
}
}
