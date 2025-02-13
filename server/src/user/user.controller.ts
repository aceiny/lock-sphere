import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from 'common/decorators/auth/get-user.decorator';
import { ResponseInterface } from 'shared/interfaces/response.interface';
import { SessionInterface } from 'shared/interfaces/session.interface';
import { User } from './entities/user.entity';
import { TfaAuthentificationService } from './tfa-authentification.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly tfaAuthentificationService: TfaAuthentificationService,
    private readonly userService: UserService
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findUser(@GetUser() user: SessionInterface): Promise<ResponseInterface<User>> {
    const data = await this.userService.findOneById(user.id);
    return {
      message: 'User found',
      status: HttpStatus.OK,
      data,
    };
  }
  @Post('/enable-tfa')
  async enableTfa(@GetUser() user: SessionInterface): Promise<ResponseInterface<User>> {
    const data = await this.tfaAuthentificationService.enableTfa(user.id);
    return {
      message: 'Two factor authentication enabled',
      status: HttpStatus.OK,
    };
  }
  @Post('/disable-tfa')
  async disableTfa(@GetUser() user: SessionInterface): Promise<ResponseInterface<User>> {
    const data = await this.tfaAuthentificationService.disableTfa(user.id);
    return {
      message: 'Two factor authentication disabled',
      status: HttpStatus.OK,
    };
  }
  @Post('/initiate-tfa-enabling')
  async initiateTfaEnabling(@GetUser() user: SessionInterface): Promise<ResponseInterface<User>> {
    const data = await this.tfaAuthentificationService.initiateTfaEnabling(user);
    return {
      message: 'Two factor authentication enabling initiated',
      status: HttpStatus.OK,
    };
  }
  @Patch()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete()
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
