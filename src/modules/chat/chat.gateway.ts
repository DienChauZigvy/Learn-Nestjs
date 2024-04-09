import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { OnModuleInit } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MessageService } from '../message/message.service';
import { UserService } from '../user/user.service';
import { CreateMessageDto } from '../message/dto/create-message.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleInit
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authService: AuthService,
    private chatService: ChatService,
    private messageService: MessageService,
    private userService: UserService,
  ) {}

  afterInit(socket: Socket): any {}

  async handleConnection(@ConnectedSocket() socket: Socket) {
    const authHeader = socket.handshake.headers.authorization;
    // console.log(authHeader);

    if (authHeader) {
      try {
        const token = authHeader.split(' ')[1];
        // console.log(111, token);
        const userId = await this.authService.handleVerifyToken(token);
        console.log(333, userId);
        socket.data.userId = userId;
      } catch (error) {
        socket.disconnect();
      }
    } else {
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    console.log('disconnect', socket.data?.userId);
  }

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('id:', socket.id);
      console.log('connected chat room');
    });
  }

  @SubscribeMessage('createMessage')
  async createMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { chatId, ...content } = createMessageDto;
    const message = await this.messageService.create(
      content,
      client.data?.userId,
      chatId,
    );

    this.server.emit('message', createMessageDto);
    return message;
  }

  @SubscribeMessage('join')
  async enterChatRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    let user = await this.userService.findById(client.data?.userId);
    user.clientId = client.id;

    user = await this.userService.findByIdAndUpdate(user._id, user);

    client.join(roomId);

    client.broadcast
      .to(roomId)
      .emit('users-changed', { user: user._id, event: 'joined' });

    return 'join';
  }
}

// import {
//   ConnectedSocket,
//   MessageBody,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   OnGatewayInit,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import { Socket, Server } from 'socket.io';
// import { AuthService } from '../auth/auth.service';
// import { OnModuleInit } from '@nestjs/common';
// import { ChatService } from './chat.service';
// import { MessageService } from '../message/message.service';
// import { UserService } from '../user/user.service';
// import { CreateMessageDto } from '../message/dto/create-message.dto';

// @WebSocketGateway({
//   cors: {
//     origin: '*',
//   },
//   // namespace: 'chats',
// })
// export class ChatGateway
//   implements
//     OnGatewayInit,
//     OnGatewayConnection,
//     OnGatewayDisconnect,
//     OnModuleInit
// {
//   @WebSocketServer()
//   server: Server;

//   constructor(
//     private readonly authService: AuthService,
//     private chatService: ChatService,
//     private messageService: MessageService,
//     private userService: UserService,
//   ) {}

//   onModuleInit() {
//     this.server.on('connection', (socket) => {
//       console.log('socketid:', socket.id);
//       console.log('connected chatroom');
//     });
//   }

//   async handleConnection(socket: Socket) {
//     const authHeader = socket.handshake.headers.authorization;
//     console.log(authHeader);

//     if (authHeader) {
//       try {
//         const token = authHeader.split(' ')[1];
//         console.log(111, token);
//         const userId = await this.authService.handleVerifyToken(token);
//         console.log(333, userId);
//         socket.data.userId = userId;
//       } catch (error) {
//         socket.disconnect();
//       }
//     } else {
//       socket.disconnect();
//     }
//   }

//   afterInit(@ConnectedSocket() socket: Socket): any {}

//   handleDisconnect(@ConnectedSocket() socket: Socket) {
//     console.log('disconnect chatroom', socket.data?.userId);
//   }

//   // @SubscribeMessage('createMessage')
//   // createMessage(
//   //   @MessageBody() createMessageDto: CreateMessageDto,
//   //   @ConnectedSocket() client: Socket,
//   // ) {
//   //   const message = this.messageService.create(
//   //     createMessageDto,
//   //     client.data?.userID,
//   //   );

//   //   this.server.emit('message', message);
//   //   return message;
//   // }

//   @SubscribeMessage('addMessage')
//   onNewMessage(@MessageBody() body: any) {
//     console.log(body);
//     this.server.emit('onMessage', {
//       msg: 'New Message',
//       content: body,
//     });
//   }

//   // @SubscribeMessage('findAllMessages')
//   // findAll(@ConnectedSocket() client: Socket) {
//   //   return this.messageService.getAllMessagesByUser(client.data?.userId);
//   // }

//   // @SubscribeMessage('join')
//   // async enterChatRoom(
//   //   @ConnectedSocket() client: Socket,
//   //   @MessageBody() roomId: string,
//   // ) {
//   //   let user = await this.userService.findById(client.data?.userId);
//   //   user.clientId = client.id;

//   //   user = await this.userService.findByIdAndUpdate(user._id, user);

//   //   client.join(roomId);

//   //   client.broadcast
//   //     .to(roomId)
//   //     .emit('users-changed', { user: user._id, event: 'joined' });
//   // }

//   // @SubscribeMessage('leave')
//   // async leaveChatRoom(@ConnectedSocket() client: Socket, roomId: string) {
//   //   let user = await this.userService.findById(client.data?.userId);

//   //   user.clientId = client.id;

//   //   user = await this.userService.findByIdAndUpdate(user._id, user);

//   //   client.broadcast
//   //     .to(roomId)
//   //     .emit('users-changed', { user: user._id, event: 'left' });
//   //   client.leave(roomId);
//   // }

//   // @SubscribeMessage('typing')
//   // async typing() {}
// }
