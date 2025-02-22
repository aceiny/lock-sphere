import { getEnvOrFatal } from 'common/utils/env.util';

export const TFA_ISSUER = getEnvOrFatal<string>('TFA_ISSUER');
export const TFA_ENCRYPTION_KEY = getEnvOrFatal<string>('TFA_ENCRYPTION_KEY')
export const CHALLENGE_CREATION_LIMIT = getEnvOrFatal<number>(
  'CHALLENGE_CREATION_LIMIT',
);
export const CHALLENGE_CREATION_WINDOW = getEnvOrFatal<number>(
  'CHALLENGE_CREATION_WINDOW',
);
export const CHALLENGE_VERIFY_LIMIT = getEnvOrFatal<number>(
  'CHALLENGE_VERIFY_LIMIT',
);
export const CHALLENGE_VERIFY_WINDOW = getEnvOrFatal<number>(
  'CHALLENGE_VERIFY_WINDOW',
);
