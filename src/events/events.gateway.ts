import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { LiveUserRepository } from '../services';

const namespaceRegex = /User:(?<userId>[a-zA-Z0-9]*)/;

@WebSocketGateway({
  namespace: namespaceRegex,
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger();

  constructor(private liveUserRepository: LiveUserRepository) {}

  handleConnection(socket: Socket): any {
    const userId = namespaceRegex.exec(socket.nsp.name)?.groups?.userId;
    if (userId) {
      this.logger.log(`Connection received from user: ${userId}`);
      socket.on('UserLogin', (data) => {
        const { userId, ...rest } = data;
        this.liveUserRepository.addUser({ id: userId, ...rest }).then(() => {
          this.logger.log(`GOT LOGIN EVENT`, { data });
        });
      });
      socket.on('UserJoinGameLobby', (data) => {
        this.liveUserRepository
          .startLookingForGame(userId, data.gameType)
          .then(() => {
            this.logger.log(`GOT UserJoinGameLobby EVENT`, {
              gameType: data.gameType,
              userId,
            });
          });
      });
    }
  }
}
