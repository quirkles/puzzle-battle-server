import { createClient } from 'redis';

const redisClient = createClient({
  password: 'password',
});

export async function main(): Promise<void> {
  // Add to redis
  await redisClient.connect();
  for await (const member of redisClient.scanIterator({
    MATCH: 'LiveUser:*',
  })) {
    for await (const result of redisClient.hScanIterator(member)) {
      // await redisClient.hDel(member, '')
      await redisClient.hDel(member, result.field);
    }
  }
  const idxs = await redisClient.ft._list();
  for (const idx of idxs) {
    await redisClient.ft.dropIndex(idx);
  }
  await redisClient.disconnect();
}

main()
  .then(() => {
    console.log('Done');
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
