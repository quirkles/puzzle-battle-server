import { Injectable } from '@nestjs/common';

import { MongoService } from '../mongoService';
import { User } from '../../../models/User';
import { WithoutId } from '../../../typeUtils';
import { Collection } from 'mongodb';

@Injectable()
export class UserRepository {
  constructor(private readonly dbService: MongoService<'User'>) {}

  createUser(user: Omit<User, 'id'>): Promise<User> {
    return this.dbService.createOne('User', user);
  }

  createOrUpdateUser(
    filter: Partial<WithoutId<User>>,
    update: Partial<WithoutId<User>>,
  ): Promise<User> {
    return this.dbService.upsert('User', filter, update);
  }

  _collection(): Collection {
    return this.dbService.getCollection('User');
  }
}
