import { Body, Get, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, Tokens } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto): Promise<Tokens> {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<Tokens> {
    return this.authService.login(loginDto);
  }
}
