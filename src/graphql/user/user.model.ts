/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field((type) => String)
  id: number;

  @Field()
  lichessUsername: string;

  @Field()
  lichessId: string;

  @Field((type) => Int)
  lichessPuzzleRating: number;
}
