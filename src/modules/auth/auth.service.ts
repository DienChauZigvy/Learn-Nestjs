import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { SignUpDto, Tokens } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<Tokens> {
    const { email, password } = createUserDto;

    const userByEmail = await this.userService.findByEmail(email);

    if (userByEmail) {
      throw new BadRequestException('Email already exist!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const tokens = this.getTokens(user._id);

    return tokens;
  }

  async login(loginDto: LoginDto): Promise<Tokens> {
    const { email, password } = loginDto;

    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = this.getTokens(user._id);

    return tokens;
  }

  async getTokens(userId: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { userId },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES'),
        },
      ),
      this.jwtService.signAsync(
        { userId },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
