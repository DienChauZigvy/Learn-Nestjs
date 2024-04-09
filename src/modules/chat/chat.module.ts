import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { ChatGateway } from './chat.gateway';
import { AuthService } from '../auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserSchema } from '../user/schemas/user.schema';
import { UserModule } from '../user/user.module';
import { MessageService } from '../message/message.service';
import { UserService } from '../user/user.service';
import { MessageSchema } from '../message/schemas/message.schema';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get('JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_ACCESS_EXPIRES'),
          },
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Message', schema: MessageSchema },
    ]),
    UserModule,
  ],
  providers: [
    ChatService,
    ChatGateway,
    AuthService,
    MessageService,
    UserService,
    UserRepository,
  ],
  controllers: [ChatController],
})
export class ChatModule {}
