import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';
import mongoose from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { Chat } from '../chat/schemas/chat.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { isValidObjectId } from 'src/utils/objectId.util';
import { ChatService } from '../chat/chat.service';
import { UserService } from '../user/user.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: mongoose.Model<Message>,
    private chatService: ChatService,
    private userService: UserService,
  ) {}

  async create(
    content: Partial<CreateMessageDto>,
    userId: string,
    chatName: string,
  ) {
    const isValidUserId = isValidObjectId(userId);
    if (!isValidUserId) throw new NotFoundException('User not found');

    const user = await this.userService.findById(userId);

    const chat: Chat = await this.chatService.findByName(chatName);

    if (!chat) {
      const chat = await this.chatService.addNewChat(userId, { chatName });
      const newMessage = await this.messageModel.create({
        ...content,
        user: user,
        chat: chat,
      });

      return newMessage as Message;
    }

    const newMessage = await this.messageModel.create({
      ...content,
      user: user,
      chat: chat,
    });

    // await newMessage.save();
    return newMessage as Message;
  }

  async getAllMessagesByUser(userId: string) {
    const messages = await this.messageModel.find({ user: userId });

    return messages;
  }
}
