import {
  IsBoolean,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Message } from 'src/modules/message/schemas/message.schema';
import { User } from 'src/modules/user/schemas/user.schema';

export class CreateChatDto {
  @IsNotEmpty()
  @IsString()
  readonly chatName: string;

  // @IsEmpty({ message: 'You cannot pass the user id' })
  // readonly users: User[];

  // @IsNotEmpty()
  // @IsString()
  // readonly host: User;

  // @IsOptional()
  // @IsBoolean()
  // readonly isGroupChat?: boolean;
}
