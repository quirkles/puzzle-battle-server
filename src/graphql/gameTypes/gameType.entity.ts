/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

export const GameTypeEnum = {
  wins_3: 'wins_3',
  wins_4: 'wins_4',
  wins_5: 'wins_5',
  time_1_min: 'time_1_min',
  time_2_mins: 'time_2_mins',
  time_3_mins: 'time_3_mins',
} as const;

export type GameTypeEnum = keyof typeof GameType;

registerEnumType(GameTypeEnum, {
  name: 'GameTypeEnum',
});

@ObjectType()
export class GameType {
  @Field((type) => GameTypeEnum)
  type: GameTypeEnum;

  @Field()
  activePlayerCount: number;
}
