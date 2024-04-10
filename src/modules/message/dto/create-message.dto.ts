import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  readonly content: string;

  @IsNotEmpty()
  @IsString()
  readonly chatName: string;

  // @IsOptional()
  // @IsBoolean()
  // readonly isWatched?: boolean;

  // readonly user?: User;

  // readonly chat?: Chat;
}
