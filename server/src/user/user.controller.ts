import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { GetUser } from 'common/decorators/auth/get-user.decorator';
import { Session } from 'shared/interfaces/session.interface';
import { ResponseInterface } from 'shared/interfaces/response.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(@GetUser() user: Session): Promise<ResponseInterface> {
    const data = await this.userService.findOneById(user.id);
    return {
      message: 'User found',
      status: HttpStatus.OK,
      data,
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
