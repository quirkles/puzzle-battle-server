/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { LiveUserRepository, UserRepository } from '../../services';
import { UserEntity } from './user.entity';
import { CreateUserArgs } from './user.args';
import { modelSchemas } from '../../models';

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
  async loginUser(@Args('userData') createUserArgs: CreateUserArgs) {
    return this.userRepository
      ._collection()
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
}
