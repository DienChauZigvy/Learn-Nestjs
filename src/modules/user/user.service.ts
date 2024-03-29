import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { get, omit } from 'lodash';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getCurrentUser(currentUserId: string) {
    const user: User = await this.userModel.findById(currentUserId).exec();
    if (!user) {
      throw new NotFoundException('User does not found');
    }

    const { password, ...newUser } = user.toJSON();

    return newUser;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel
      .findOne({ email: createUserDto.email })
      .exec();
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id);
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
    currentUserId: string,
  ): Promise<User> {
    if (currentUserId !== id) {
      throw new UnauthorizedException(
        'You are not authorized to update this user',
      );
    }
    const user = await this.userModel.findById(currentUserId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      throw new BadRequestException('Email cannot be changed');
    }

    const updateUserDtoWithoutEmail = { ...updateUserDto };
    delete updateUserDtoWithoutEmail.email;

    return this.userModel
      .findByIdAndUpdate(currentUserId, updateUserDto, {
        new: true,
        runValidators: true,
      })
      .exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, {
        new: true,
        runValidators: true,
      })
      .exec();
  }

  async remove(id: string, currentUserId: string) {
    if (currentUserId !== id) {
      throw new UnauthorizedException(
        'You are not authorized to delete this user',
      );
    }

    const user: User = await this.userModel.findByIdAndDelete(id).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...newUser } = user.toObject();
    return newUser;
  }
}
