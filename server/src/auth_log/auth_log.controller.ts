import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AuthLogService } from './auth_log.service';
import { ResponseInterface } from 'shared/interfaces/response.interface';
import { PaginatedResponse } from 'shared/interfaces/paginated.response.interface';
import { AuthLog } from './entities/auth_log.entity';
import { GetUser } from 'common/decorators/auth/get-user.decorator';
import { SessionInterface } from 'shared/interfaces/session.interface';
import { default_offset, default_page } from 'shared/constants/pagination';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth log')
@Controller('auth-log')
export class AuthLogController {
  constructor(private readonly authLogService: AuthLogService) {}

  @ApiOperation({
    summary: 'Get paginated auth logs',
    description: 'Get paginated auth logs for the user',
  })
  @ApiResponse({
    status: 200,
    description: 'Auth logs fetched successfully',
  })
  @ApiCookieAuth('session-auth')
  @Get()
  async getAuthLogs(
    @GetUser() user: SessionInterface,
    @Query('page', new DefaultValuePipe(default_page), ParseIntPipe)
    page: number,
    @Query('offset', new DefaultValuePipe(default_offset), ParseIntPipe)
    offset: number,
  ): Promise<ResponseInterface<PaginatedResponse<AuthLog>>> {
    const data = await this.authLogService.getPaginatedAuthLogs(
      user.id,
      page,
      offset,
    );
    return {
      message: 'Auth Logs fetched successfully',
      status: HttpStatus.OK,
      data,
    };
  }
}
