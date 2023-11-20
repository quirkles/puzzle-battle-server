import { EventEmitter } from 'events';

import { createClient } from '@redis/client';

import { Injectable, Logger } from '@nestjs/common';

import { Entities } from '../entities';
import { CacheRepository } from './CacheRepository';

@Injectable()
export class RedisCacheRepository
  extends EventEmitter
  implements CacheRepository
{
  private readonly logger = new Logger(RedisCacheRepository.name);

  private client;

  constructor() {
    super();
    this.client = createClient({
      password: 'password',
    });
    this.client.emit = this.emit.bind(this.client);
  }

  private async connect(): Promise<Error | void> {
    if (!this.client.isOpen) {
      return await this.client.connect().catch((err) => {
        this.logger.error('Failed to connect:');
        if (err instanceof AggregateError) {
          for (const error of err.errors) {
            this.logger.error(error);
          }
        } else {
          this.logger.error(err);
        }
        return err;
      });
    }
  }

  async getAll<T extends keyof Entities>(
    entityType: T,
  ): Promise<Entities[T][]> {
    await this.connect();
    const keys: string[] = await this.findAllEntityKeys(entityType);
    return (await Promise.all(
      keys.map(this.retrieveFromKey.bind(this)),
    )) as Entities[T][];
  }

  // getOne<T extends keyof Entities>(id: string, type: T): Promise<Entities[T]> {
  //   return Promise.resolve({} as any);
  // }
  //
  // setMany<T extends keyof Entities>(
  //   entity: Entities[T][],
  //   type: T,
  // ): Promise<void> {
  //   return Promise.resolve(undefined);
  // }

  async setOne<T extends keyof Entities>(
    entity: Entities[T],
    type: T,
  ): Promise<void> {
    await this.connect();
    const multi = this.client.multi();
    const { id, ...rest } = entity;
    const key = `${type}:${id}`;
    for (const [field, value] of Object.entries(rest)) {
      multi.hSet(key, field, value);
    }
    await multi.exec();
    return;
  }

  private async findAllEntityKeys(
    entityType: keyof Entities,
  ): Promise<string[]> {
    const results: string[] = [];
    let cursor: null | number = null;
    while (cursor !== 0) {
      const scanReply: {
        keys: string[];
        cursor: number;
      } = await this.client
        .scan(cursor || 0, { MATCH: `${entityType}:*` })
        .then();
      results.push(...scanReply.keys);
      cursor = Number(scanReply['cursor']);
    }
    return results;
  }

  async getEntityCount(entityType: keyof Entities): Promise<number> {
    const error = await this.connect();
    if (error) {
      throw error;
    }
    let count = 0;
    let cursor: null | number = null;
    while (cursor !== 0) {
      const scanReply: {
        keys: string[];
        cursor: number;
      } = await this.client
        .scan(cursor || 0, { MATCH: `${entityType}:*` })
        .then();
      count += scanReply.keys.length;
      cursor = Number(scanReply['cursor']);
    }
    return count;
  }

  private retrieveFromKey(key: string): Promise<Record<string, unknown>> {
    return this.client.hGetAll(key).then((body) => ({
      ...body,
      id: key.slice(key.indexOf(':') + 1),
    }));
  }
}
