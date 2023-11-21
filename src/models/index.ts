import { User, userSchema } from './User';
import { LiveUser, liveUserSchema } from './LiveUser';
import { ZodSchema } from 'zod';

export interface Entities {
  User: User;
  LiveUser: LiveUser;
}

export type EntityType = keyof Entities;

export const modelSchemas: { [T in EntityType]: ZodSchema<Entities[T]> } = {
  User: userSchema,
  LiveUser: liveUserSchema,
} as const;

export type Entity = Entities[keyof Entities];
