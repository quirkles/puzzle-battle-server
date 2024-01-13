import { Injectable } from '@nestjs/common';

import { RedisCacheService } from '../RedisCacheService';
import { Entities } from '../../../models';
import { GameType } from '../../../models/LiveUser';

@Injectable()
export class LiveUserRepository {
  constructor(private cacheService: RedisCacheService) {}

  getCount(): Promise<number> {
    return this.cacheService.getEntityCount('LiveUser');
  }

  getAll(): Promise<Entities['LiveUser'][]> {
    return this.cacheService.getAll('LiveUser');
  }

  async addUser(user: Entities['LiveUser']): Promise<Entities['LiveUser']> {
    await this.cacheService.setOne(user, 'LiveUser');
    return user;
  }

  startLookingForGame(userId: string, gameType: GameType) {
    return this.cacheService.updateOne('LiveUser', userId, {
      lookingForGame: gameType,
    });
  }
}
