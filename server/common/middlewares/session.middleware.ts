import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import 'express-session';

declare module 'express-session' {
  interface Session {
    passport?: {
      user?: any;
    };
  }
}
@Injectable()
export class SessionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.session?.passport?.user) {
      req.user = req.session.passport.user;
      return next();
    }

    throw new UnauthorizedException('Session expired or not found');
  }
}
