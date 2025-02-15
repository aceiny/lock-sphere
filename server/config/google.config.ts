import { getEnvOrFatal } from "common/utils/env.util";

export const GoogleConfig = {
    clientID: getEnvOrFatal('GOOGLE_CLIENT_ID'), 
    clientSecret: getEnvOrFatal('GOOGLE_CLIENT_SECRET'), 
    callbackURL: getEnvOrFatal('GOOGLE_CALLBACK_URL'),
    scope: ['email', 'profile'],
  }