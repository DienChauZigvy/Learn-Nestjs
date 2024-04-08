import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Message } from 'src/modules/message/schemas/message.schema';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: [true, 'Duplicate email entered'] })
  email: string;

  @Prop({
    default:
      'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
  })
  avatar: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  refreshToken: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ default: false })
  isOnline: boolean;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }])
  messages: Message[];
}

export const UserSchema = SchemaFactory.createForClass(User);
