import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import MongooseClassSerializerInterceptor from 'src/common/interceptor/mongooseSerializer.interceptor';
import { isValidObjectId } from 'src/utils/objectId.util';
import { AccessTokenGuard } from '../../common/guard/accessToken.guard';
import { CurrentUserId } from './decorators/currentUser.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll() {
    return this.userService.getAllUsers();
  }

  @Get('/current-user')
  @UseGuards(AccessTokenGuard)
  // @UseInterceptors(MongooseClassSerializerInterceptor(User))
  async getCurrentUser(@CurrentUserId() currentUserId: string) {
    const user = await this.userService.getCurrentUser(currentUserId);
    if (!user)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    return user;
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUserId() currentUserId: string,
  ) {
    isValidObjectId(id);
    return this.userService.updateUser(id, updateUserDto, currentUserId);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUserId() currentUserId: string) {
    isValidObjectId(id);
    return this.userService.remove(id, currentUserId);
  }
}
