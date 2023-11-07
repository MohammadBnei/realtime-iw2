import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: true,
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  chatMessages: { username: string; content: string; timeSent: string }[] = [];
  clients: { username: string; id: string }[] = [];

  handleConnection(client: any, ...args: any[]) {
    console.log('client connected : ', client.id);
    client.emit('old-messages', this.chatMessages);
    this.clients.push({ username: '', id: client.id });
  }
  handleDisconnect(client: any) {
    console.log('client disconnected : ', client.id);
    this.clients = this.clients.filter((c) => c.id !== client.id);
  }

  @SubscribeMessage('username-set')
  handleUsernameSet(client: any, payload: any): void {
    const c = this.clients.find((c) => c.id === client.id);
    if (c) {
      c.username = payload.username;
    }

    console.log({ clients: this.clients });
  }

  @SubscribeMessage('username-free')
  handleUsernameFree(client: any, { username }: { username: string }): boolean {
    const c = this.clients.find((c) => c.username === username);
    console.log({ c });
    if (c) {
      return false;
    }
    return true;
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): void {
    console.log({ payload });
    this.server.emit('message', payload);
    this.chatMessages.push(payload);
  }

  @SubscribeMessage('test')
  handleTest(client: any, payload: any): void {
    console.log({ payload });
  }
}
