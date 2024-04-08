import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  users: { [key: string]: string } = {};

  handleConnection(@MessageBody() message: any, client: Socket) {
    // Handle client connection
    // console.log('Client connected: ' + client.id,message);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected: ' + client.id);
    delete this.users[client.id];
    this.server.emit('users', Object.values(this.users));
  }

  @SubscribeMessage('chat')
  handleMessage(
    @MessageBody() message: any,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(message);

    this.server.to(message.chat._id).emit('chat', message);
  }

  @SubscribeMessage('isTyping')
  isTyping(@MessageBody() userData: any) {
    this.server.to(userData.roomId).emit('isTyping', userData);
  }

  @SubscribeMessage('callUser')
  handleCallUser(
    @MessageBody() callData: any,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(callData, '=============');
    client.broadcast.to(callData.roomId).emit('reciveCall', callData);
  }

  @SubscribeMessage('answerCall')
  handleAnswerCall(
    @MessageBody()
    callData: {
      signal: { type: string; sdp: string };
      to: {
        name: string;
        id: string;
        roomId: string;
      };
    },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(callData, '=============callAccepted');
    client.broadcast
      .to(callData.to.roomId)
      .emit('callAccepted', callData.signal);
  }
}
