import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './schemas/chat.schema';
import mongoose from 'mongoose';
import { CreateChatDto } from './dto/create-chat.dto';
import { UserService } from '../user/user.service';
import { isValidObjectId } from 'src/utils/objectId.util';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: mongoose.Model<Chat>,
    private userService: UserService,
  ) {}

  // async create(content: CreateChatDto, userId: string): Promise<Chat> {
  //   const user = await this.userService.findById(userId);

  //   if (!user) throw new NotFoundException('User does not found');

  //   const newChat = new this.chatModel({ ...content, createdBy: userId });
  //   await newChat.save();
  //   newChat.users.push(user);

  //   await this.userService.addNewChat(user._id, newChat);
  //   return newChat;
  // }

  async findById(id: string) {
    if (!isValidObjectId(id))
      throw new NotFoundException('Chat room not found');

    const chat = await this.chatModel.findById(id);

    if (!chat) throw new NotFoundException('Chat room not found');

    return chat;
  }

  async findByName(chatName: string) {
    return this.chatModel.findOne({ chatName }).exec();
  }

  async addNewChat(
    userId: string,
    createChatDto: CreateChatDto,
  ): Promise<Chat> {
    if (!isValidObjectId(userId)) {
      throw new NotFoundException('User not found');
    }
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const chat = await this.chatModel.findOne({
      chatName: createChatDto.chatName,
    });

    if (chat) throw new BadRequestException('Chat room already exists');

    const newChat = new this.chatModel({
      chatName: createChatDto.chatName,
      host: user,
    });
    newChat.users.push(user);
    // user.chats.push()
    return await newChat.save();
    // user.chats.push(chat);
    // await user.save();
  }

  async getChatRoomByUser(userId: string): Promise<User> {
    if (!isValidObjectId(userId)) {
      throw new NotFoundException('User not found');
    }

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userHost = await this.chatModel.findOne({ host: user });

    return userHost.host;
  }

  async getChatRoomByUserID(userId: string): Promise<Chat[]> {
    if (!isValidObjectId(userId)) {
      throw new NotFoundException('User not found');
    }

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userHost = await this.chatModel
      .find({ host: user })
      .populate('host')
      .populate('users');
    console.log(userHost);
    return userHost;
  }

  async addUserToChatRoom(createChatDto: CreateChatDto, userId: string) {
    const chat = await this.chatModel.findOne({
      chatName: createChatDto.chatName,
    });
    if (chat) {
      const user = await this.userService.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      chat.users.push(user);

      await chat.save();

      // const hostChat = await this.getChatRoomByUser(userId);
      // if (hostChat._id === userId) {
      //   chat.host.socketId = user.socketId;
      //   await user.save();
      // }
    } else {
      await this.addNewChat(userId, createChatDto);
    }
  }

  async findChatsByUserSocketId(socketId: string): Promise<Chat[]> {
    const chats = await this.chatModel.find({
      users: { $elemMatch: { socketId } },
    });

    if (!chats) throw new NotFoundException('Chat rooms not found');
    return chats;
  }

  async getAllChats() {
    return this.chatModel.find();
  }
}
