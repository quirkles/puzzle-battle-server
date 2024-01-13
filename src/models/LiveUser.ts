import z from 'zod';

const GameType = {
  'first-to-3': 'first-to-3',
  'first-to-4': 'first-to-4',
  'first-to-5': 'first-to-5',
  '1-min': '1-min',
  '2-mins': '2-mins',
  '3-mins': '3-mins',
} as const;

export type GameType = keyof typeof GameType;

export const liveUserSchema = z.object({
  id: z.string(),
  lichessPuzzleRating: z.number(),
  lookingForGame: z
    .null()
    .or(z.enum(Object.keys(GameType) as [string, ...string[]])),
});

export type LiveUser = z.infer<typeof liveUserSchema>;
