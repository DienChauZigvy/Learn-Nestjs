import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Chat } from 'src/modules/chat/schemas/chat.schema';
import { User } from 'src/modules/user/schemas/user.schema';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop()
  content: string;

  @Prop()
  senderId: string;

  @Prop({ default: false })
  isWatched: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' })
  chat: Chat;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
