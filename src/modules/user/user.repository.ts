import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { Chat } from '../chat/schemas/chat.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findById(id: string): Promise<User> {
    return this.userModel.findById({ _id: id }, { password: 0 }).exec();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find({}, { password: 0 }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, {
        projection: { password: 0 },
        new: true,
        runValidators: true,
      })
      .exec();
  }

  async delete(id: string): Promise<User> {
    return this.userModel
      .findByIdAndDelete({ _id: id }, { password: 0 })
      .exec();
  }

  // async addNewChat(userId: string, chat: Chat): Promise<void> {
  //   const user = await this.findById(userId);
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }
  //   user.chats.push(chat);
  //   await user.save();
  // }
}
