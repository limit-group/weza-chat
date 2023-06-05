import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private connectedUsers = [];
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('WS Initialized');
  }

  subscribeOtherUser(room: string, otherUserId: number) {
    const userSockets = this.connectedUsers.filter(
      (user) => user.userId == otherUserId,
    );
    userSockets.map((userInfo) => {
      const socketConn = this.server.sockets.sockets.get(userInfo.socketId);
      if (socketConn) {
        socketConn.join(room);
      }
    });
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`${client.id} connected`);
    console.log(this.connectedUsers);
  }

  @SubscribeMessage('identity')
  handleUserIdentity(client: Socket, user: any) {
    const userId = user.userId
    this.connectedUsers.push({
      socketId: client.id,
      userId: userId.toString(),
    });
    console.log(this.connectedUsers);
  }

  @SubscribeMessage('userSubscribe')
  handleSubscribe(client: Socket, room: string, otherUserId: 0) {
    this.subscribeOtherUser(room, otherUserId);
    client.join(room);
  }


  @SubscribeMessage('userTyping')
  handleUserTyping(client: Socket) {
    this.server.emit("userTyping", client.id)
  }

  @SubscribeMessage('userUnsubscribe')
  handleUnsubscribe(client: Socket, room: string) {
    client.leave(room);
  }

  handleDisconnect(client: Socket) {
    this.connectedUsers = this.connectedUsers.filter(
      (user) => user.socketId !== client.id,
    );
  }
}
