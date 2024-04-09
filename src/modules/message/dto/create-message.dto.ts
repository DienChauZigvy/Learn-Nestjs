import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Chat } from 'src/modules/chat/schemas/chat.schema';
import { User } from 'src/modules/user/schemas/user.schema';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  readonly content: string;

  @IsNotEmpty()
  @IsString()
  readonly chatId: string;

  // @IsOptional()
  // @IsBoolean()
  // readonly isWatched?: boolean;

  // readonly user?: User;

  // readonly chat?: Chat;
}
