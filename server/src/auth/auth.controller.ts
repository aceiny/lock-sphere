import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from 'common/guards/auth/local.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ResponseInterface } from 'shared/interfaces/response.interface';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseInterface> {
    const data = await this.authService.signup(createUserDto);
    return {
      message: 'Signup succesfully',
      status: HttpStatus.CREATED,
    };
  }
  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(): Promise<ResponseInterface> {
    const data = await this.authService.signin();
    return {
      message: 'Signin succesfully',
      status: HttpStatus.CREATED,
    };
  }
  @Post('/signout')
  async signout(@Req() req: Request): Promise<ResponseInterface> {
    const data = await this.authService.signout(req);
    return {
      message: 'Logout succesfully',
      status: HttpStatus.OK,
    };
  }
}
