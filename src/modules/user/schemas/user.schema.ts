import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Chat } from 'src/modules/chat/schemas/chat.schema';
import { Message } from 'src/modules/message/schemas/message.schema';

export enum Status {
  ONLINE = 'Online',
  OFFLINE = 'Offline',
  BUSY = 'Busy',
}

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

  // @Prop({ default: false })
  // isAdmin: boolean;

  @Prop()
  socketId?: string;

  @Prop({ default: Status.OFFLINE })
  status: Status;

  // @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }])
  // chats?: Chat[];

  // @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }])
  // messages?: Message[];
}

export const UserSchema = SchemaFactory.createForClass(User);
