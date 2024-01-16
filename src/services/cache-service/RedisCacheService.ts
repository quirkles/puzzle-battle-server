import { EventEmitter } from 'events';

import { createClient } from '@redis/client';
import { Injectable, Logger } from '@nestjs/common';

import { Entities, Entity, EntityType } from '../../models';
import { CacheService } from './CacheService';

@Injectable()
export class RedisCacheService extends EventEmitter implements CacheService {
  private readonly logger = new Logger(RedisCacheService.name);

  private readonly client;

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

  async getAll<T extends EntityType>(entityType: T): Promise<Entities[T][]> {
    await this.connect();
    const keys: string[] = await this.findAllEntityKeys(entityType);
    return (await Promise.all(
      keys.map(this.retrieveFromKey.bind(this)),
    )) as Entities[T][];
  }

  async setOne<T extends EntityType>(
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

  async updateOne<T extends EntityType>(
    type: T,
    id: string,
    update: Partial<Omit<Entities[T], 'id'>>,
  ): Promise<void> {
    await this.connect();
    const multi = this.client.multi();
    const key = `${type}:${id}`;
    for (const [field, value] of Object.entries(update)) {
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

  async raw(commands: string[]): Promise<unknown> {
    await this.connect();
    return this.client.sendCommand(commands);
  }

  private async retrieveFromKey<T extends Entity>(key: string): Promise<T> {
    const body = await this.client.hGetAll(key);
    return {
      ...body,
      id: key.slice(key.indexOf(':') + 1),
    } as T;
  }
}
