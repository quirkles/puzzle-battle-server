import { Query, Resolver } from '@nestjs/graphql';

import { LiveUserRepository } from '../../services';

import { GameType } from './gameType.entity';

@Resolver(() => GameType)
export class GameTypeResolver {
  constructor(private liveUserRepository: LiveUserRepository) {}

  @Query(() => [GameType])
  async liveSummary(): Promise<GameType[]> {
    return this.liveUserRepository.getGameTypesSummary();
  }
}
