import { getEnvOrFatal } from "common/utils/env.util";

export const SessionConfig = {
    secret: getEnvOrFatal("SESSION_SECRET"),
    resave: getEnvOrFatal("SESSION_RESAVE"),
    saveUninitialized: getEnvOrFatal("SESSION_SAVE_UNINITIALIZED"),
    cookie: { secure : getEnvOrFatal("COOKIE_SECURE"),  maxAge: getEnvOrFatal("COOKIE_EXPIRATION") },
  }