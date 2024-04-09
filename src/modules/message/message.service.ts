import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';
import mongoose from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { Chat } from '../chat/schemas/chat.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { isValidObjectId } from 'src/utils/objectId.util';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: mongoose.Model<Message>,
  ) {}

  async create(
    content: Partial<CreateMessageDto>,
    userId: string,
    chatId: string,
  ) {
    const isValidUserId = isValidObjectId(userId);
    if (!isValidUserId) throw new NotFoundException('User not found');

    const isValidChatId = isValidObjectId(chatId);

    if (!isValidChatId) throw new NotFoundException('Chat room not found');
    const newMessage = await this.messageModel.create({
      ...content,
      user: userId,
      chat: chatId,
    });
    // await newMessage.save();
    console.log('newMessage', newMessage);
    return newMessage;
  }

  async getAllMessagesByUser(userId: string) {
    const messages = await this.messageModel.find({ user: userId });

    return messages;
  }
}
