/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entities, Entity, EntityType } from '../../models';

export abstract class DbService {
  getOneById<T extends EntityType>(
    entityType: T,
    id: string,
  ): Promise<Entities[T] | null> {
    throwNotImplemented();
  }
  findByField<T extends EntityType, U extends keyof Entities[T]>(
    entityType: T,
    field: U,
    value: Entities[T][U],
  ): Promise<Entities[T][]> {
    throwNotImplemented();
  }
  createOne<T extends EntityType>(
    entityType: T,
    body: Omit<Entities[T], 'id'>,
  ): Promise<Entities[T]> {
    throwNotImplemented();
  }
}

function throwNotImplemented(): never {
  throw new Error('Not implemented in abstract base class');
}
