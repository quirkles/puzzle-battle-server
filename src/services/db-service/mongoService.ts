import { MongoClient, ObjectId } from 'mongodb';

import { DbService } from './dbService';
import { Entities, EntityType, modelSchemas } from '../../models';
import { util } from 'zod';
import Omit = util.Omit;

const connectionString = 'mongodb://localhost:27017';

export class MongoService implements DbService {
  private readonly client: MongoClient;
  private readonly dbName = 'puzzle-battle';

  constructor() {
    this.client = new MongoClient(connectionString);
  }

  async findByField<T extends EntityType, U extends keyof Entities[T]>(
    entityType: T,
    field: U,
    value: Entities[T][U],
  ): Promise<Entities[T][]> {
    return this.client
      .db(this.dbName)
      .collection(entityType)
      .find({
        [field]: value,
      })
      .toArray()
      .then((docs) => docs.map((d) => modelSchemas[entityType].parse(d)));
  }

  getOneById<T extends EntityType>(
    entityType: T,
    id: string,
  ): Promise<Entities[T] | null> {
    return this.client
      .db(this.dbName)
      .collection(entityType)
      .findOne({ _id: new ObjectId(id) })
      .then((doc) => modelSchemas[entityType].parse(doc));
  }

  createOne<T extends EntityType>(
    entityType: T,
    body: Omit<Entities[T], 'id'>,
  ): Promise<Entities[T]> {
    return this.client
      .db(this.dbName)
      .collection(entityType)
      .insertOne(body)
      .then((result) =>
        modelSchemas[entityType].parse({
          ...body,
          id: result.insertedId.toString(),
        }),
      );
  }
}
