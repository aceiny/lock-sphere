import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { getEnvOrFatal } from 'common/utils/env.util';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'shared/interfaces/jwt.interface';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: getEnvOrFatal("JWT_SECRET"),
      ignoreExpiration : false
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}