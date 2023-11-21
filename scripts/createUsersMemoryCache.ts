import { createClient } from '@redis/client';
import { MongoClient } from 'mongodb';
import { modelSchemas } from '../src/models';
import { LiveUser } from '../src/models/LiveUser';

const redisClient = createClient({
  password: 'password',
});

const mongoClient = new MongoClient('mongodb://localhost:27017');

export async function createUsersMemoryCache(count: number): Promise<void> {
  await mongoClient.connect();
  await redisClient.connect();
  const users = await mongoClient
    .db('puzzle-battle')
    .collection('User')
    .aggregate([{ $sample: { size: count } }])
    .toArray();
  for (const user of users) {
    user['id'] = user['_id'].toString();
    const validated = modelSchemas['User'].parse(user);
    const liveUser: LiveUser = {
      id: validated.id,
      lichessPuzzleRating: validated.lichessPuzzleRating,
    };
    await redisClient.hSet(
      `User:${validated.id}`,
      'lichessPuzzleRating',
      liveUser.lichessPuzzleRating,
    );
  }
  await mongoClient.close();
  await redisClient.disconnect();
}
