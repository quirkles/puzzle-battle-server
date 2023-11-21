/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateUserArgs {
  @Field()
  lichessUsername: string;

  @Field({ nullable: true })
  username: string;

  @Field()
  lichessId: string;

  @Field((type) => Int)
  lichessPuzzleRating: number;
}
