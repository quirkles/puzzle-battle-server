import { Injectable } from '@nestjs/common';

import { MongoService } from '../mongoService';
import { User } from '../../../models/User';

@Injectable()
export class UserRepository {
  constructor(private dbService: MongoService) {}

  createUser(user: Omit<User, 'id'>): Promise<User> {
    return this.dbService.createOne('User', user);
  }
}
