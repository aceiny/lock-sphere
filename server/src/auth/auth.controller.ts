import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from 'common/guards/auth/local.guard';
import { CreateUserDto } from 'src/user/types/create-user.dto';
import { ResponseInterface } from 'shared/interfaces/response.interface';
import { Request, Response } from 'express';
import { SessionInterface } from 'shared/interfaces/session.interface';
import { GetUser } from 'common/decorators/auth/get-user.decorator';
import { VerifyTfaDto } from 'src/user/types/verify-tfa.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GoogleAuthGuard } from 'common/guards/auth/google-auth.guard';
import { getEnvOrFatal } from 'common/utils/env.util';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly FRONTEND_URL = getEnvOrFatal('FRONTEND_URL')
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // This will redirect the user to Google's login page
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@GetUser() user : SessionInterface , @Req() req: Request , @Res({passthrough : true}) res: Response) : Promise<void> {
    if (!user) {
      throw new UnauthorizedException('Google authentication failed');
    }
    console.log(res)
    await new Promise<void>((resolve, reject) => {
      req.login(user, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    return res.redirect(`${this.FRONTEND_URL}/auth/loading`);
  }

  @ApiOperation({
    summary: 'Signup a new user',
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
    summary: 'Signin a user',
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
    summary: 'Signout a user',
  })
  @Post('/signout')
  async signout(@Req() req: Request , @Res({passthrough : true}) res : Response): Promise<ResponseInterface<null>> {
    const data = await this.authService.signout(req , res);
    return {
      message: 'Logout succesfully',
      status: HttpStatus.OK,
    };
  }

  @ApiOperation({
    summary: 'Verify two factor authentication',
  })
  @Post('/verify-tfa')
  async verifyTfa(
    @Body() verifyTfaDto: VerifyTfaDto,
    @Req() req : Request,
  ): Promise<ResponseInterface<null>> {
    const data = await this.authService.verifyTfa(verifyTfaDto);
    return new Promise((resolve, reject) => {
      req.login(data, (err) => {
        if (err) {
          return reject(err);
        }
        resolve({ message: 'TFA verified, session signed', status: HttpStatus.OK });
      });
    });
  }

  @ApiOperation({
    summary: 'validate the session',
  })
  @Get('validate-session')
  async validateSession(@GetUser() user: SessionInterface): Promise<ResponseInterface<null>> {
    if(!user || !user.id) {
      throw new UnauthorizedException('Invalid session');
    }
    return {
      message: 'Session is valid',
      status: HttpStatus.OK,
    };
  }
}
