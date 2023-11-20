import { BaseEntity } from './base';

export interface UserEntity extends BaseEntity {
  lichessId: string;
  lichessUsername: string;
  lichessRating: string;
}
