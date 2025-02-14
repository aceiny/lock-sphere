import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary : "main page entery" ,
    description : "if server is up and working it will return a welcome message "
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
