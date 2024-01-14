import { Injectable } from '@nestjs/common';

import { RedisCacheService } from '../RedisCacheService';
import { Entities } from '../../../models';
import {
  GameType,
  GameTypeEnum,
} from '../../../graphql/gameTypes/gameType.entity';

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

  startLookingForGame(userId: string, gameType: GameTypeEnum) {
    return this.cacheService.updateOne('LiveUser', userId, {
      lookingForGame: gameType,
      isLookingForGame: 'TRUE',
    });
  }

  async getGameTypesSummary(): Promise<GameType[]> {
    const query = (await this.cacheService.raw([
      'FT.AGGREGATE',
      'idx:looking_for_game',
      '@isLookingForGame:{ TRUE }',
      'GROUPBY',
      '1',
      '@lookingForGame',
      'REDUCE',
      'COUNT',
      '0',
      'as',
      'count',
    ])) as [string[]];
    return query.slice(1).map((querySet) => {
      return {
        type: querySet[1] as GameTypeEnum,
        activePlayerCount: Number(querySet[3]),
      };
    });
  }
}
