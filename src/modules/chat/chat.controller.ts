import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AccessTokenGuard } from 'src/common/guard/accessToken.guard';
import { CurrentUserId } from '../user/decorators/currentUser.decorator';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('/create')
  @UseGuards(AccessTokenGuard)
  async createChat(
    @CurrentUserId() currentUserId: string,
    @Body() createChat: CreateChatDto,
  ) {
    // console.log(22, createChat);
    return this.chatService.create(createChat, currentUserId);
  }
}
