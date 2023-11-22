import { Injectable } from '@nestjs/common';

import { Collection } from 'mongodb';

import { MongoService } from '../mongoService';
import { User } from '../../../models/User';
import { WithoutId } from '../../../typeUtils';
import { modelSchemas } from '../../../models';

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

  handleLogin(createUserArgs: {
    lichessPuzzleRating: number;
    lichessUsername: string;
    lichessId: string;
  }) {
    this._collection()
      .findOneAndUpdate(
        { lichessId: createUserArgs.lichessId },
        {
          $set: { ...createUserArgs },
          $setOnInsert: {
            username: createUserArgs.lichessUsername,
          },
        },
        { upsert: true, returnDocument: 'after' },
      )
      .then((result) =>
        modelSchemas['User'].parse({
          ...result,
          id: (result?._id || '').toString(),
        }),
      );
  }

  private _collection(): Collection {
    return this.dbService.getCollection('User');
  }
}
