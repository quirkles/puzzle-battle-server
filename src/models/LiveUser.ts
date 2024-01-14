import z from 'zod';

import { GameTypeEnum } from '../graphql/gameTypes/gameType.entity';

export const liveUserSchema = z.object({
  id: z.string(),
  lichessPuzzleRating: z.number(),
  isLookingForGame: z.enum(['TRUE', 'FALSE']),
  lookingForGame: z
    .null()
    .or(z.enum(Object.keys(GameTypeEnum) as [string, ...string[]])),
});

export type LiveUser = z.infer<typeof liveUserSchema>;
