import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Tokens } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Request } from 'express';
import { AccessTokenGuard } from '../../common/guard/accessToken.guard';
import { RefreshTokenGuard } from '../../common/guard/refreshToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto): Promise<{ message: string }> {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<Tokens> {
    return this.authService.login(loginDto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  logout(@Req() req: Request) {
    // console.log(req.user);
    return this.authService.logout(req.user['userId']);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refreshTokens(@Req() req: Request) {
    // console.log('111controller', req.user);
    const userId = req.user['userId'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
