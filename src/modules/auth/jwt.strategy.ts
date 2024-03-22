// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { User } from '../user/schemas/user.schema';
// import { Model } from 'mongoose';

// @Injectable()
// export class JWTStrategy extends PassportStrategy(Strategy) {
//   constructor(@InjectModel(User.name) private userModel: Model<User>) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: process.env.JWT_ACCESS_SECRET,
//     });
//   }

//   async validate(payload) {
//     const { id } = payload;

//     const user = await this.userModel.findById(id);

//     if (!user) {
//       throw new UnauthorizedException('Login first to access this endpoint.');
//     }

//     return user;
//   }
// }
