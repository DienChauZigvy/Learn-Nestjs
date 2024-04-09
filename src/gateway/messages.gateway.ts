// import { OnModuleInit } from '@nestjs/common';
// import {
//   MessageBody,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import { Server } from 'socket.io';

// @WebSocketGateway({
//   cors: {
//     origin: '*',
//   },
// })
// export class MessagesGateway implements OnModuleInit {
//   @WebSocketServer()
//   server: Server;

//   onModuleInit() {
//     this.server.on('connection', (socket) => {
//       console.log('id:', socket.id);
//       console.log('connected test');
//     });
//   }

//   @SubscribeMessage('addMessage')
//   onNewMessage(@MessageBody() body: any) {
//     console.log(body);
//     this.server.emit('onMessage', {
//       msg: 'New Message',
//       content: body,
//     });
//   }
// }
