import { Collection, MongoClient, ObjectId } from 'mongodb';

import { DbService } from './dbService';
import { Entities, EntityType, modelSchemas } from '../../models';
import { WithoutId } from '../../typeUtils';

const connectionString = 'mongodb://localhost:27017';

export class MongoService<T extends EntityType> implements DbService<T> {
  private readonly client: MongoClient;
  private readonly dbName = 'puzzle-battle';

  constructor() {
    this.client = new MongoClient(connectionString);
  }

  async findByField<U extends keyof Entities[T]>(
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

  getOneById(entityType: T, id: string): Promise<Entities[T] | null> {
    return this.client
      .db(this.dbName)
      .collection(entityType)
      .findOne({ _id: new ObjectId(id) })
      .then((doc) => modelSchemas[entityType].parse(doc));
  }

  createOne(
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

  upsert(
    entityType: T,
    filter: Partial<WithoutId<Entities[T]>>,
    body: Partial<WithoutId<Entities[T]>>,
  ): Promise<Entities[T]> {
    return this.client
      .db(this.dbName)
      .collection(entityType)
      .findOneAndUpdate(
        filter,
        { $set: { ...body } },
        { upsert: true, returnDocument: 'after' },
      )
      .then((result) =>
        modelSchemas[entityType].parse({
          ...body,
          id: (result?._id || '').toString(),
        }),
      );
  }

  getCollection(entity: T): Collection {
    return this.client.db(this.dbName).collection(entity);
  }
}
