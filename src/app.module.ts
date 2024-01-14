import { join } from 'path';

import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  LiveUserRepository,
  RedisCacheService,
  UserRepository,
  MongoService,
} from './services';
import { UsersResolver } from './graphql/user/user.resolver';
import { EventsGateway } from './events/events.gateway';
import { GameTypeResolver } from "./graphql/gameTypes/gameType.resolver";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // repositories
    LiveUserRepository,
    UserRepository,
    // services
    RedisCacheService,
    MongoService,
    //Resolvers
    UsersResolver,
    GameTypeResolver,
    // Sockets
    EventsGateway,
  ],
})
export class AppModule {}
