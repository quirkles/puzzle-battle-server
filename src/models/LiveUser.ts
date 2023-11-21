import z from 'zod';

export const liveUserSchema = z.object({
  id: z.string(),
  lichessPuzzleRating: z.number(),
});

export type LiveUser = z.infer<typeof liveUserSchema>;
