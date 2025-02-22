import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis,
  ) {}
  async DeleteKey(key: string): Promise<any> {
    return await this.redisClient.del(key);
  }
  async GetKey(key: string, parse: boolean = false): Promise<any> {
    switch (parse) {
      case true:
        return JSON.parse(await this.redisClient.get(key));
      case false:
        return await this.redisClient.get(key);
    }
  }

  async SetKey(
    key: string,
    value: string,
    ttl?: number,
    stringify: boolean = false,
  ) {
    if (ttl) {
      switch (stringify) {
        case true:
          await this.redisClient.set(key, JSON.stringify(value), 'EX', ttl);
          break;
        case false:
          await this.redisClient.set(key, value, 'EX', ttl);
      }
    } else {
      switch (stringify) {
        case true:
          await this.redisClient.set(key, JSON.stringify(value));
          break;
        case false:
          await this.redisClient.set(key, value);
      }
    }
  }
  async IncrementKey(key: string): Promise<number> {
    return await this.redisClient.incr(key);
  }
  async KeyExists(key: string): Promise<boolean> {
    const result = await this.redisClient.exists(key);
    return !!result;
  }
  async GetKeys(pattern: string): Promise<string[]> {
    return await this.redisClient.keys(pattern);
  }
  async flushAll(): Promise<any> {
    return await this.redisClient.flushall();
  }
  async flushDB(): Promise<any> {
    return await this.redisClient.flushdb();
  }
}
