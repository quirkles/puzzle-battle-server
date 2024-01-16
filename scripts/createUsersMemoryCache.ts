import { createClient } from '@redis/client';
import { MongoClient } from 'mongodb';
import { LiveUser, modelSchemas } from '../src/models';
import { getRandomKey } from '../src/utils';
import { GameTypeEnum } from '../src/graphql/gameTypes/gameType.entity';

const redisClient = createClient({
  password: 'password',
});

const mongoClient = new MongoClient('mongodb://localhost:27017');

export async function createUsersMemoryCache(count: number): Promise<void> {
  // Fetch users
  await mongoClient.connect();
  const users = await mongoClient
    .db('puzzle-battle')
    .collection('User')
    .aggregate([{ $sample: { size: count } }])
    .toArray();

  // Add to redis
  await redisClient.connect();
  for (const user of users) {
    const lookingForGame =
      Math.random() < 0.8 ? null : getRandomKey(GameTypeEnum);
    const liveUser: LiveUser = modelSchemas['LiveUser'].parse({
      id: user['_id'].toString(),
      lichessPuzzleRating: user.lichessPuzzleRating,
      lookingForGame,
      isLookingForGame: lookingForGame ? 'TRUE' : 'FALSE',
    });
    await redisClient.hSet(
      `LiveUser:${liveUser.id}`,
      'lichessPuzzleRating',
      liveUser.lichessPuzzleRating,
    );
    await redisClient.hSet(
      `LiveUser:${liveUser.id}`,
      'isLookingForGame',
      liveUser.isLookingForGame,
    );
    if (liveUser.lookingForGame) {
      await redisClient.hSet(
        `LiveUser:${liveUser.id}`,
        'lookingForGame',
        liveUser.lookingForGame,
      );
    }
  }
  await mongoClient.close();
  await redisClient.disconnect();
}
