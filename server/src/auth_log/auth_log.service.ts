import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthLog } from './entities/auth_log.entity';
import { PaginatedResponse } from 'shared/interfaces/paginated.response.interface';

@Injectable()
export class AuthLogService {
  constructor(
    @InjectRepository(AuthLog)
    private readonly authLogRepository: Repository<AuthLog>,
  ) {}
  async getAuthLogs(userId : string , page : number , offset : number): Promise<PaginatedResponse<AuthLog>> {
    const [aut_logs , total] = await this.authLogRepository.findAndCount({
        where : {user : {id : userId}},
        order : {loggedAt : "DESC"},
        skip : (page - 1) * offset,
        take : offset

    });
    return {
        data : aut_logs,
        total,
        page,
        offset,
        totalPages: Math.ceil(total / offset),
      }
  }
}
