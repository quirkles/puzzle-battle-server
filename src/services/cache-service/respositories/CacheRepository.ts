import { EventEmitter } from 'events';

import { type Entities } from '../entities';

export interface CacheRepository extends EventEmitter {
  // getOne<T extends keyof Entities>(id: string, type: T): Promise<Entities[T]>;

  setOne<T extends keyof Entities>(
    entity: Omit<Entities[T], 'type'>,
    type: T,
  ): Promise<void>;

  // setMany<T extends keyof Entities>(
  //   entity: Omit<Entities[T], 'type'>[],
  //   type: T,
  // ): Promise<void>;

  getAll<T extends keyof Entities>(entityType: T): Promise<Entities[T][]>;
}
