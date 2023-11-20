/* eslint-disable @typescript-eslint/no-unused-vars */
import { Int, Query, Resolver } from '@nestjs/graphql';
import { RedisCacheRepository } from '../../services';
import { User } from './user.model';

@Resolver((of: unknown) => User)
export class UsersResolver {
  constructor(private redisCacheRepository: RedisCacheRepository) {}

  @Query((returns) => Int)
  async liveUserCount(): Promise<number> {
    return this.redisCacheRepository.getEntityCount('User');
  }
}
