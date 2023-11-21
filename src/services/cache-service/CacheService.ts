import { EventEmitter } from 'events';
import { Entities, EntityType } from '../../models';

export interface CacheService extends EventEmitter {
  // getOne<T extends keyof Entities>(id: string, type: T): Promise<Entities[T]>;

  setOne<T extends EntityType>(
    entity: Omit<Entities[T], 'type'>,
    type: T,
  ): Promise<void>;

  // setMany<T extends keyof Entities>(
  //   entity: Omit<Entities[T], 'type'>[],
  //   type: T,
  // ): Promise<void>;

  getAll<T extends keyof Entities>(entityType: T): Promise<Entities[T][]>;
}
