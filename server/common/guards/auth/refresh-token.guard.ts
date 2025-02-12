import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
    handleRequest<TUser = any>(err: any, user: TUser, info: any): TUser {
    if (err || !user) {
        throw new UnauthorizedException();
    }
    return user;
}
}
