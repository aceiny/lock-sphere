import { getEnvOrFatal } from 'common/utils/env.util';
import { SessionOptions } from 'express-session';

export const SessionConfig: SessionOptions = {
  name: getEnvOrFatal('COOKIE_NAME'),
  secret: getEnvOrFatal('SESSION_SECRET'),
  resave: getEnvOrFatal('SESSION_RESAVE'),
  saveUninitialized: getEnvOrFatal('SESSION_SAVE_UNINITIALIZED'),
  rolling: getEnvOrFatal('SESSION_ROLLING'),
  cookie: {
    secure: getEnvOrFatal('COOKIE_SECURE'),
    maxAge: getEnvOrFatal('COOKIE_EXPIRATION'),
    httpOnly: getEnvOrFatal('COOKIE_HTTP_ONLY'),
    sameSite: getEnvOrFatal('COOKIE_SAME_SITE'),
    domain : getEnvOrFatal('COOKIE_DOMAIN'),
    path : '/'
  },
};
