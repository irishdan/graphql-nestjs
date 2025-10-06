import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { CacheHandlerInterface } from '../cache-handler.interface';
import { DtoInterface } from '~/common/dto/dto.interface';

@Injectable()
export class CacheHandlerRedis implements CacheHandlerInterface {
  protected redis: Redis;
  private readonly logger = new Logger('CacheHandler');

  constructor(private config: ConfigService) {
    const host = this.config.get<string>('REDIS_HOST');
    const port = parseInt(this.config.get<string>('REDIS_PORT') ?? '6379');

    this.redis = new Redis({
      host,
      port,
    });

    this.redis.on('connect', () => {
      this.logger.log(`Redis: Connected; Host: ${host} Port: ${port}`);
    });

    this.redis.on('ready', async () => {
      this.logger.log('Redis: Ready');
    });

    this.redis.on('reconnecting', () => {
      this.logger.log('Redis: Reconnecting');
    });

    this.redis.on('end', () => {
      this.logger.log('Redis: Disconnected');
    });

    this.redis.on('error', (error) => {
      this.logger.error('Redis: Error:', `Host: ${host} Port: ${port}`, error.message);
    });
  }

  async get<T extends object>(key: string, transformer?: (data: object) => T): Promise<T | null> {
    const data = await this.redis.get(key);

    if (!data) {
      return null;
    }

    const obj: T = JSON.parse(data);

    if (obj && transformer) {
      return transformer(obj);
    }

    return obj;
  }

  async set(dto: DtoInterface, ttl?: number): Promise<void> {
    const key = dto.getKey();

    // set a default ttl:
    // 120 days in seconds
    if (!ttl) {
      ttl = 60 * 60 * 24 * 120;
    }

    await this.redis.set(key, JSON.stringify(dto), 'EX', ttl);
  }
}
