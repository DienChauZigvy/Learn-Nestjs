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
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly userRepository: UserRepository,
  ) {}

  async getCurrentUser(currentUserId: string) {
    const user: User = await this.userRepository.findById(currentUserId);
    if (!user) {
      throw new NotFoundException('User does not found');
    }

    // const { password, ...newUser } = user.toJSON();

    return { id: user._id, username: user.name, email: user.email };
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
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
    const user = await this.userRepository.findById(currentUserId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      throw new BadRequestException('Email cannot be changed');
    }

    const updateUserDtoWithoutEmail = { ...updateUserDto };
    delete updateUserDtoWithoutEmail.email;

    return this.userRepository.update(currentUserId, updateUserDto);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: string, currentUserId: string) {
    if (currentUserId !== id) {
      throw new UnauthorizedException(
        'You are not authorized to delete this user',
      );
    }

    const user: User = await this.userRepository.delete(currentUserId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // const { password, ...newUser } = user.toObject();
    return user;
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: string) {
    return this.userRepository.findById(id);
  }
}
