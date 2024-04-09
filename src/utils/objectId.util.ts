import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

export const isValidObjectId = (id: string): boolean => {
  if (!Types.ObjectId.isValid(id)) {
    throw new NotFoundException('Invalid Object ID');
  }

  return true;
};
