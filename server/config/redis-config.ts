import { getEnvOrFatal } from 'common/utils/env.util';
import { RedisOptions } from 'ioredis';
import { ConnectionOptions } from 'tls';

export const RedisConfig: RedisOptions = {
  host: getEnvOrFatal('REDIS_HOST'),
  port: getEnvOrFatal('REDIS_PORT'),
  /*username: getEnvVar("REDIS_USERNAME"),
  password: getEnvVar("REDIS_PASSWORD"),
  tls: {
    servername: getEnvVar("REDIS_SERVER_NAME"),
  },*/ // local development
};
