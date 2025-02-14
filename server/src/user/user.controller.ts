import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './types/update-user.dto';
import { GetUser } from 'common/decorators/auth/get-user.decorator';
import { ResponseInterface } from 'shared/interfaces/response.interface';
import { SessionInterface } from 'shared/interfaces/session.interface';
import { User } from './entities/user.entity';
import { TfaAuthentificationService } from './tfa-authentification.service';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VerifyTfaDto } from './types/verify-tfa.dto';
import { verify } from 'crypto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly tfaAuthentificationService: TfaAuthentificationService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: 'get user profile data' })
  @ApiCookieAuth('session-auth')
  @Get()
  async findUser(
    @GetUser() user: SessionInterface,
  ): Promise<ResponseInterface<User>> {
    const data = await this.userService.findOneById(user.id);
    return {
      message: 'User found',
      status: HttpStatus.OK,
      data,
    };
  }

  @ApiOperation({ summary: 'initiate  tfa enabling for user' })
  @ApiCookieAuth('session-auth')
  @Post('/initiate-tfa')
  async initiateTfaEnabling(
    @GetUser() user: SessionInterface,
  ): Promise<ResponseInterface<any>> {
    const data = await this.tfaAuthentificationService.initiateTfaEnabling(
      user.id,
    );
    return {
      message: 'Two factor authentication is now pending verifaction',
      status: HttpStatus.OK,
      data,
    };
  }
  @ApiOperation({ summary: 'enable tfa for user' })
  @ApiCookieAuth('session-auth')
  @Post('/enable-tfa')
  async enableTfa(
    @GetUser() user: SessionInterface,
    @Body() VerifyTfaDto: VerifyTfaDto,
  ): Promise<ResponseInterface<User>> {
    const data = await this.tfaAuthentificationService.enableTfa(
      user.id,
      VerifyTfaDto.token,
    );
    return {
      message: 'Two factor authentication enabled',
      status: HttpStatus.OK,
    };
  }

  @ApiOperation({ summary: 'disable tfa for user' })
  @ApiCookieAuth('session-auth')
  @Post('/disable-tfa')
  async disableTfa(
    @GetUser() user: SessionInterface,
  ): Promise<ResponseInterface<User>> {
    const data = await this.tfaAuthentificationService.disableTfa(user.id);
    return {
      message: 'Two factor authentication disabled',
      status: HttpStatus.OK,
    };
  }

  @ApiOperation({ summary: 'update user info' })
  @ApiCookieAuth('session-auth')
  @Patch()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'delete user profile from the app' })
  @ApiCookieAuth('session-auth')
  @Delete()
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
