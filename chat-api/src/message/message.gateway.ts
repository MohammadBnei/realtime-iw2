import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: true,
})
export class MessageGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): void {
    console.log({ payload });
    this.server.emit('message', payload);
  }

  @SubscribeMessage('test')
  handleTest(client: any, payload: any): void {
    console.log({ payload });
  }
}
