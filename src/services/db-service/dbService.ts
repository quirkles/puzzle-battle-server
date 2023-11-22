/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entities, Entity, EntityType } from '../../models';
import { WithoutId } from '../../typeUtils';
import { Collection } from 'mongodb';

export abstract class DbService<T extends EntityType> {
  getOneById(entityType: T, id: string): Promise<Entities[T] | null> {
    throwNotImplemented();
  }
  findByField<U extends keyof Entities[T]>(
    entityType: T,
    field: U,
    value: Entities[T][U],
  ): Promise<Entities[T][]> {
    throwNotImplemented();
  }
  createOne(entityType: T, body: WithoutId<Entities[T]>): Promise<Entities[T]> {
    throwNotImplemented();
  }
  upsert(
    entityType: T,
    filter: Partial<WithoutId<Entities[T]>>,
    body: Partial<WithoutId<Entities[T]>>,
  ): Promise<Entities[T]> {
    throwNotImplemented();
  }

  getCollection(entity: T): Collection {
    throwNotImplemented();
  }
}

function throwNotImplemented(): never {
  throw new Error('Not implemented in abstract base class');
}
