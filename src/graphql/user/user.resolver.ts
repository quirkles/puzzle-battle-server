/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { LiveUserRepository, UserRepository } from '../../services';
import { UserEntity } from './user.entity';
import { CreateUserArgs } from './user.args';

@Resolver((of: unknown) => UserEntity)
export class UsersResolver {
  constructor(
    private liveUserRepository: LiveUserRepository,
    private userRepository: UserRepository,
  ) {}

  @Query((returns) => Int)
  async liveUserCount(): Promise<number> {
    return this.liveUserRepository.getCount();
  }

  @Mutation((returns) => UserEntity)
  async createUser(@Args('userData') createUserArgs: CreateUserArgs) {
    if (!createUserArgs['username']) {
      createUserArgs['username'] = createUserArgs.lichessUsername;
    }
    return this.userRepository.createUser(createUserArgs);
  }
}
