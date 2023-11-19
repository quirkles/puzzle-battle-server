import { EventEmitter } from 'events';

import { createClient } from '@redis/client';

import { Injectable } from '@nestjs/common';

import { Entities } from '../entities';
import { CacheRepository } from './CacheRepository';

@Injectable()
export class RedisCacheRepository
  extends EventEmitter
  implements CacheRepository
{
  private client;

  constructor() {
    super();
    this.client = createClient();
    this.client.emit = this.emit.bind(this.client);
  }

  private async connect() {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  async getAll<T extends keyof Entities>(
    entityType: T,
  ): Promise<Entities[T][]> {
    await this.connect();
    const keys: string[] = await this.findAllEntityKeys(entityType);
    console.log('keys', keys);
    return Promise.all(keys.map(this.retrieveFromKey.bind(this))) as Promise<
      Entities[T][]
    >;
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
      console.log('set', key, field, value);
      multi.hSet(key, field, value);
    }
    multi.exec();
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

  private retrieveFromKey(key: string): Promise<Record<string, unknown>> {
    return this.client.hGetAll(key).then((body) => ({
      ...body,
      id: key.slice(key.indexOf(':') + 1),
    }));
  }
}
