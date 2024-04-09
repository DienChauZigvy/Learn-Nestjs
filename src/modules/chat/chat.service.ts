import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './schemas/chat.schema';
import mongoose from 'mongoose';
import { CreateChatDto } from './dto/create-chat.dto';
import { UserService } from '../user/user.service';
import { isValidObjectId } from 'src/utils/objectId.util';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: mongoose.Model<Chat>,
    private userService: UserService,
  ) {}

  async create(content: CreateChatDto, userId: string): Promise<Chat> {
    const user = await this.userService.findById(userId);

    if (!user) throw new NotFoundException('User does not found');

    const newChat = new this.chatModel({ ...content, createdBy: userId });
    await newChat.save();
    newChat.users.push(user);

    await this.userService.addNewChat(user._id, newChat);
    return newChat;
  }

  async findById(id: string) {
    if (!isValidObjectId(id))
      throw new NotFoundException('Chat room not found');

    const chat = await this.chatModel.findById(id);

    if (!chat) throw new NotFoundException('Chat room not found');

    return chat;
  }
}
