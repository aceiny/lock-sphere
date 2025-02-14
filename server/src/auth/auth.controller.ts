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
import { VerifyTfaDto } from 'src/user/dto/verify-tfa.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary : 'Signup a new user',
  })
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
  @ApiOperation({
    summary : 'Signin a user',
  })
  @ApiResponse({
    status: 201,
    description: 'Signin succesfully',
  })
  @ApiResponse({
    status: 401,
    description: 'invalid credentials or requires two factor authentication', 
  })
  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(
    @Req() req: Request,
    @GetUser() user: SessionInterface,
  ): Promise<ResponseInterface<null>> {
    const data = await this.authService.signin(req, user);
    return {
      message: 'Signin succesfully',
      status: HttpStatus.OK,
    };
  }

  @ApiOperation({
    summary : 'Signout a user',
  })
  @Post('/signout')
  async signout(@Req() req: Request): Promise<ResponseInterface<null>> {
    const data = await this.authService.signout(req);
    return {
      message: 'Logout succesfully',
      status: HttpStatus.OK,
    };
  }

  @ApiOperation({
    summary : 'Verify two factor authentication',
  })
  @Post('/verify-tfa')
  async verifyTfa(
    @Req() req: Request,
    @Body() verifyTfaDto: VerifyTfaDto,
  ): Promise<ResponseInterface<null>> {
    const data = await this.authService.verifyTfa(req, verifyTfaDto);
    return {
      message: 'Two factor authentication verified',
      status: HttpStatus.OK,
    };
  }
}
