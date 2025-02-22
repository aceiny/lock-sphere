import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthLog } from './entities/auth_log.entity';
import { PaginatedResponse } from 'shared/interfaces/paginated.response.interface';
import { CreateAuthLogInterface } from './type/create-auth-log.interface';
import { Request } from 'express';
import { AuthLogStatusEnum } from 'src/auth_log/type/auth-log.status.enum';
import * as geoip from 'geoip-lite';
import { AuthLogSourceEnum } from './type/auth-log.source.enum';
import {UAParser} from 'ua-parser-js';

@Injectable()
export class AuthLogService {
  constructor(
    @InjectRepository(AuthLog)
    private readonly authLogRepository: Repository<AuthLog>,
  ) {}
  async getPaginatedAuthLogs(
    userId: string,
    page: number,
    offset: number,
  ): Promise<PaginatedResponse<AuthLog>> {
    const [aut_logs, total] = await this.authLogRepository.findAndCount({
      where: { user: { id: userId } },
      order: { loggedAt: 'DESC' },
      skip: (page - 1) * offset,
      take: offset,
    });
    return {
      data: aut_logs,
      total,
      page,
      offset,
      totalPages: Math.ceil(total / offset),
    };
  }
  async findAllByUserId(userId: string): Promise<AuthLog[]> {
    return this.authLogRepository.find({
      where: { user: { id: userId } },
      order: { loggedAt: 'DESC' },
    });
  }
  async createAuthLog(
    req: Request,
    userId: string,
    source : AuthLogSourceEnum
  ): Promise<AuthLog> {
    const location = geoip.lookup(req.ip);
    console.log(location);
    const agent_parser = new UAParser(req.headers['user-agent'] || 'Unknown',);
    console.log(agent_parser);
    const auth_log_data: CreateAuthLogInterface = {
        ip_address: req.ip,
        user_agent: `${agent_parser.getBrowser()} - ${agent_parser.getOS()}`,
        status: AuthLogStatusEnum.SUCCESS,
        location : location ? `${location.city}, ${location.country}` : 'Unknown',
        source : source,
    }
    const auth_log = this.authLogRepository.create({
      ...auth_log_data,
      user: { id: userId },
    });
    return this.authLogRepository.save(auth_log);
  }
}
