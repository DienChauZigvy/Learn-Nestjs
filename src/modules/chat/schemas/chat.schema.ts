import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Message } from 'src/modules/message/schemas/message.schema';
import { User } from 'src/modules/user/schemas/user.schema';

@Schema({ timestamps: true })
export class Chat extends Document {
  @Prop({ required: true })
  chatName: string;

  @Prop({ default: false })
  isGroupChat: boolean;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }])
  messages: Message[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
  users: User[];

  @Prop({ type: 'ObjectId', ref: 'User' })
  createdBy: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
