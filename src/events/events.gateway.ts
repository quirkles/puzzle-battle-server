import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  namespace: /User:[a-zA-Z0-9]+/,
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection {
  private readonly logger = new Logger(EventsGateway.name);

  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket): any {
    this.logger.log(`Connection received`, socket.nsp.name);
    socket.on('UserLogin', (data) => {
      this.logger.log(`GOT LOGIN EVENT`, { data });
    });
  }
}
