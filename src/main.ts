import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createClient } from 'redis';
import { SchemaFieldTypes } from '@redis/search';

const PORT = process.env['PORT'] || '3030';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(Number(3030));
  const client = createClient({
    password: 'password',
  });
  await client.connect();
  await client.ft
    .create(
      'idx:game_type_with_rating',
      {
        lookingForGame: SchemaFieldTypes.TEXT,
        lichessPuzzleRating: SchemaFieldTypes.NUMERIC,
      },
      {
        ON: 'HASH',
        PREFIX: 'LiveUser',
      },
    )
    .catch((err) => {
      if ((err as Error).message.includes('Index already exists')) {
        console.log('Index already exists: idx:game_type_with_rating');
      } else {
        throw err;
      }
    });
  await client.ft
    .create(
      'idx:looking_for_game',
      {
        isLookingForGame: SchemaFieldTypes.TAG,
        lookingForGame: {
          type: SchemaFieldTypes.TAG,
          SORTABLE: true,
        },
      },
      {
        ON: 'HASH',
        PREFIX: 'LiveUser',
      },
    )
    .catch((err) => {
      if ((err as Error).message.includes('Index already exists')) {
        console.log('Index already exists: idx:looking_for_game');
      } else {
        throw err;
      }
    });
}
bootstrap().then(() =>
  console.log(`Server started at http://localhost:${PORT}`),
);
