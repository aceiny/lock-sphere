import { getEnvOrFatal } from 'common/utils/env.util';
import { SessionOptions } from 'express-session';
import { CookieConfig } from './cookies.config';

export const SessionConfig: SessionOptions = {
  name: getEnvOrFatal('COOKIE_NAME'),
  secret: getEnvOrFatal('SESSION_SECRET'),
  resave: getEnvOrFatal('SESSION_RESAVE'),
  saveUninitialized: getEnvOrFatal('SESSION_SAVE_UNINITIALIZED'),
  rolling: getEnvOrFatal('SESSION_ROLLING'),
  cookie: CookieConfig,
};
