import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(
    err: Error | null,
    user: TUser | false,
    info: any,
  ): TUser {
    if (err || !user) {
      throw new UnauthorizedException();
    }
    return user as TUser;
  }
}
