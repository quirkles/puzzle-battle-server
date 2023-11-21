import { createUsersDb } from './createUsersDb';
import { createUsersMemoryCache } from './createUsersMemoryCache';
import { parse } from 'ts-command-line-args';

interface SeedArgs {
  onlyCache?: boolean;
  dbUsers?: number;
  liveUsersInCache?: number;
}

const defaultDbUsers = 1000;
const defaultLiveUsersInCache = 100;

async function main() {
  const args = parse<SeedArgs>({
    onlyCache: { type: Boolean, optional: true, defaultOption: false },
    dbUsers: { type: Number, optional: true, defaultValue: defaultDbUsers },
    liveUsersInCache: {
      type: Number,
      optional: true,
      defaultValue: defaultLiveUsersInCache,
    },
  });
  if (!args.onlyCache) {
    console.log(`Creating ${args.dbUsers || defaultDbUsers} users in db`);
    await createUsersDb(args.dbUsers || defaultDbUsers);
  }
  console.log(
    `Creating ${
      args.liveUsersInCache || defaultLiveUsersInCache
    } live users in cache`,
  );
  await createUsersMemoryCache(
    args.liveUsersInCache || defaultLiveUsersInCache,
  );
}

main()
  .then(() => {
    console.log('Done');
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
