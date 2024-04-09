import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Status } from '../schemas/user.schema';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter the correct email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;

  @IsOptional()
  @IsString()
  readonly refreshToken: string;

  @IsOptional()
  @IsBoolean()
  readonly isAdmin: boolean;

  @IsOptional()
  @IsString()
  readonly clientId?: string;

  @IsOptional()
  @IsEnum(Status, { message: 'Please use correct status' })
  readonly status: Status;
}
