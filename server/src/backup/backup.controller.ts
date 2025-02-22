import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { BackupService } from './backup.service'
import { GetUser } from 'common/decorators/auth/get-user.decorator';
import { SessionInterface } from 'shared/interfaces/session.interface';
import { ResponseInterface } from 'shared/interfaces/response.interface';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}
  @Get()
  async getCopyOfBackup(
    @GetUser() user : SessionInterface,
  ) : Promise<ResponseInterface<any>>{
    const data = await this.backupService.getCopyOfBackup(user.id)
    return {
      message : 'Data backup generated sucessfully',
      status : HttpStatus.OK,
      data 
    }
  }
}
