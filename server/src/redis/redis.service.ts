import { Inject, Injectable } from "@nestjs/common";
import { Redis } from "ioredis";

@Injectable()
export class RedisService {
  constructor(
    @Inject("REDIS_CLIENT")
    private readonly redisClient: Redis,
  ) {}
  async DeleteKey(key: string): Promise<any> {
    return await this.redisClient.del(key);
  }
  async GetKey(key: string): Promise<any> {
    return JSON.parse(await this.redisClient.get(key));
  }

  async SetKey(key: string, value: any): Promise<any> {
    return await this.redisClient.set(key, JSON.stringify(value));
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
