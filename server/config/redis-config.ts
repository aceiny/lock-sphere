import { getEnvOrFatal } from 'common/utils/env.util';
import { RedisOptions } from 'ioredis';

export const RedisConfig: RedisOptions = {
  host: getEnvOrFatal('REDIS_HOST'),
  port: getEnvOrFatal('REDIS_PORT'),
  //password: getEnvOrFatal("REDIS_PASSWORD"),
};
