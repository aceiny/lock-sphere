import { Duration } from 'luxon';
import * as dotenv from 'dotenv';
dotenv.config();

type EnvVarType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'duration'
  | 'url'
  | 'enum'
  | 'port';

interface EnvVarConfig {
  type: EnvVarType;
  enumValues?: string[];
}

const ENV_VAR_TYPES: Record<string, EnvVarConfig> = {
  // General App Configuration
  APP_ENV: { type: 'enum', enumValues: ['development', 'staging', 'production'] },
  APP_PORT: { type: 'port' },
  APP_DEBUG: { type: 'boolean' },
  FRONTEND_URL: { type: 'url' },
  BACKEND_URL: { type: 'url' },

  // Security & Authentication
  JWT_SECRET: { type: 'string' },
  JWT_EXPIRATION: { type: 'duration' },
  JWT_REFRESH_SECRET: { type: 'string' },
  JWT_REFRESH_EXPIRATION: { type: 'duration' },
  HASH_SALT: { type: 'number' },

  // Database Configuration

  DB_PORT: { type: 'port' },
  DB_SSL_MODE: { type: 'enum', enumValues: ['enable', 'disable'] },
  POOL_SIZE: { type: 'number' },
  POOL_TIMEOUT: { type: 'duration' },
  POOL_MAX_CONN_LIFETIME: { type: 'duration' },

  // session configuration
  SESSION_SECRET: { type: 'string' },
  SESSION_RESAVE: { type: 'boolean' },
  SESSION_SAVE_UNINITIALIZED: { type: 'boolean' },

  // Cookie Configuration
  COOKIE_SECURE: { type: 'boolean' },
  COOKIE_HTTPONLY: { type: 'boolean' },
  COOKIE_EXPIRATION: { type: 'number' },

  // tfa configuration
  TFA_ISSUER: { type: 'string' },
  TFA_SECRET_TTL: { type: 'number' },

  CHALLENGE_CREATION_LIMIT: { type: 'number' },
  CHALLENGE_CREATION_WINDOW: { type: 'number' },
  CHALLENGE_VERIFY_LIMIT: { type: 'number' },
  CHALLENGE_VERIFY_WINDOW: { type: 'number' },
  // Redis Configuration
  REDIS_PORT: { type: 'port' }
};

function parseDuration(value: string): Duration {
  const durationRegex = /^(\d+)([smhd])$/;
  const match = value.match(durationRegex);
  
  if (!match) {
    throw new Error(`Invalid duration format: ${value}. Expected format: number + unit (s/m/h/d)`);
  }

  const [, amount, unit] = match;
  const unitMap: Record<string, string> = {
    's': 'seconds',
    'm': 'minutes',
    'h': 'hours',
    'd': 'days'
  };

  return Duration.fromObject({ [unitMap[unit]]: parseInt(amount) });
}

function parseEnvValue(value: string, config: EnvVarConfig): any {
  switch (config.type) {
    case 'string':
      return value;
    
    case 'number':
      const num = Number(value);
      if (isNaN(num)) {
        throw new Error(`Value "${value}" cannot be converted to a number`);
      }
      return num;
    
    case 'boolean':
      if (value.toLowerCase() === 'true') return true;
      if (value.toLowerCase() === 'false') return false;
      throw new Error(`Value "${value}" cannot be converted to a boolean`);
    
    case 'duration':
      return parseDuration(value);
    
    case 'url':
      try {
        return new URL(value).toString();
      } catch {
        throw new Error(`Value "${value}" is not a valid URL`);
      }
    
    case 'enum':
      if (!config.enumValues?.includes(value)) {
        throw new Error(`Value "${value}" must be one of: ${config.enumValues?.join(', ')}`);
      }
      return value;
    
    case 'port':
      const port = parseInt(value);
      if (isNaN(port) || port < 1 || port > 65535) {
        throw new Error(`Value "${value}" is not a valid port number (1-65535)`);
      }
      return port;
    
    default:
      return value;
  }
}

function getEnvOrFatal<T>(name: string): T {
  const value = process.env[name];
  
  if (!value) {
    throw new Error(`${name} environment variable is required.`);
  }

  const config = ENV_VAR_TYPES[name] || { type: 'string' };
  
  try {
    return parseEnvValue(value, config) as T;
  } catch (error) {
    throw new Error(`Error parsing environment variable ${name}: ${(error as Error).message}`);
  }
}

export { getEnvOrFatal };