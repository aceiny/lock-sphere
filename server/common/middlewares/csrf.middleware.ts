import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { doubleCsrf } from 'csrf-csrf';
import { getEnvOrFatal } from 'common/utils/env.util';

const { generateToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => getEnvOrFatal<string>('CSRF_COOKIE'), // Replace with a secure secret key
  cookieName: getEnvOrFatal<string>('CSRF_COOKIE_NAME'),
  cookieOptions: { httpOnly: true, secure: getEnvOrFatal('APP_ENV') === 'production' },
  size: 64, 
});

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const csrfToken = generateToken(req, res);
    res.locals.csrfToken = csrfToken;
    doubleCsrfProtection(req, res, next);
  }
}