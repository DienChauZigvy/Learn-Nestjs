import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export interface IBaseModel {
  _id: mongoose.Types.ObjectId;
}

@Schema({ timestamps: true })
export abstract class BaseModel implements IBaseModel {
  @Prop({ type: mongoose.Types.ObjectId, required: true })
  _id: mongoose.Types.ObjectId;
}
