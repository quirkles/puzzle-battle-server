import { MongoClient } from 'mongodb';
import { faker } from '@faker-js/faker';

import { User, modelSchemas } from '../src/models';
import { WithoutId } from '../src/typeUtils';

const mongoClient = new MongoClient('mongodb://localhost:27017');

export async function createUsersDb(userCount: number): Promise<void> {
  await mongoClient.connect();
  let i = 0;
  while (i < userCount) {
    await saveUserMongo(createRandomUser());
    i++;
  }
  await mongoClient.close();
  return;
}

export function saveUserMongo(user: WithoutId<User>): Promise<User> {
  return mongoClient
    .db('puzzle-battle')
    .collection('User')
    .insertOne(user)
    .then((result) =>
      modelSchemas['User'].parse({
        ...user,
        id: result.insertedId.toString(),
      }),
    );
}

function createRandomUser(): WithoutId<User> {
  return {
    lichessId: faker.string.alphanumeric(8),
    lichessPuzzleRating: faker.number.int({ min: 1500, max: 2500 }),
    lichessUsername: faker.internet.userName(),
    username: faker.internet.userName(),
  };
}
