import { Injectable } from '@nestjs/common';

import { RedisCacheService } from '../RedisCacheService';
import { Entities } from '../../../models';

@Injectable()
export class LiveUserRepository {
  constructor(private cacheService: RedisCacheService) {}

  getCount(): Promise<number> {
    return this.cacheService.getEntityCount('User');
  }

  getAll(): Promise<Entities['User'][]> {
    return this.cacheService.getAll('User');
  }

  addUser(user: Entities['User']): Promise<Entities['User']> {
    return this.cacheService.setOne(user, 'User').then(() => user);
  }
}
