import { getEnvOrFatal } from "common/utils/env.util";
import { CookieOptions } from "express";

export const CookieConfig : CookieOptions = {
    secure: getEnvOrFatal('APP_ENV') == 'production',
    maxAge: getEnvOrFatal('COOKIE_EXPIRATION'),
    httpOnly: getEnvOrFatal('COOKIE_HTTP_ONLY'),
    sameSite: getEnvOrFatal('COOKIE_SAME_SITE'),
    domain : getEnvOrFatal('COOKIE_DOMAIN'),
    path : '/'
  }