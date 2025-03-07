import { AuthLogSourceEnum } from './auth-log.source.enum';
import { AuthLogStatusEnum } from './auth-log.status.enum';

export interface CreateAuthLogInterface {
  ip_address: string;
  user_agent: string;
  status: AuthLogStatusEnum;
  reason?: string;
  location?: string;
  source : AuthLogSourceEnum
}
