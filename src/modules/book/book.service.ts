import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schemas/book.schema';
import * as mongoose from 'mongoose';
import { Query } from 'express-serve-static-core';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: mongoose.Model<Book>,
  ) {}

  async getAllBooks(query: Query) {
    const resPerpage = 2;
    const count = await this.bookModel.countDocuments({}).exec();
    const totalPage = Math.floor((count - 1) / resPerpage) + 1;
    const currentPage = Number(query.page) || 1;
    const skip = resPerpage * (currentPage - 1);
    const keyword = query.keyword
      ? {
          title: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};
    const books = await this.bookModel
      .find({ ...keyword })
      .limit(resPerpage)
      .skip(skip);
    return { books, totalPage, currentPage };
  }

  async create(book: Book, user: User): Promise<Book> {
    const data = Object.assign(book, { user: user._id });

    const res = await this.bookModel.create(data);
    return res;
  }

  async findById(id: string): Promise<Book> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('PLease enter correct id.');
    }
    const book = await this.bookModel.findById(id);

    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async updateById(id: string, book: Book): Promise<Book> {
    return await this.bookModel.findByIdAndUpdate(id, book, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id: string): Promise<Book> {
    return await this.bookModel.findByIdAndDelete(id);
  }
}
