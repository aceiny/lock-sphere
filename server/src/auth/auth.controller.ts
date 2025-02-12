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
import { SessionInterface } from 'shared/interfaces/session.interface';
import { GetUser } from 'common/decorators/auth/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseInterface<null>> {
    const data = await this.authService.signup(createUserDto);
    return {
      message: 'Signup succesfully',
      status: HttpStatus.CREATED,
    };
  }
  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(@Req() req : Request , @GetUser() user : SessionInterface): Promise<ResponseInterface<null>> {
    const data = await this.authService.signin(req , user);
    return {
      message: 'Signin succesfully',
      status: HttpStatus.CREATED,
    };
  }
  @Post('/signout')
  async signout(@Req() req: Request): Promise<ResponseInterface<null>> {
    const data = await this.authService.signout(req);
    return {
      message: 'Logout succesfully',
      status: HttpStatus.OK,
    };
  }
}
