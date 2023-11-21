import z from 'zod';

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  lichessId: z.string(),
  lichessUsername: z.string(),
  lichessPuzzleRating: z.number(),
});

export type User = z.infer<typeof userSchema>;
