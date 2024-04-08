import { Callback, FilterQuery, Model, QueryOptions } from 'mongoose';
import { BaseModel } from '../dto';
import { SaveOptions } from './repository.interface';
import { DocumentNotFoundError } from '../errors';

export abstract class BaseRepository<M extends BaseModel> {
  constructor(private readonly repository: Model<M>) {}

  // async findAll(): Promise<M[]> {
  //   return this.repository.find().exec();
  // }

  async findById(
    id: string,
    projection?: { [K in keyof M]?: number },
    options?: QueryOptions,
  ): Promise<M | null> {
    const doc = this.repository
      .findOne({ _id: id }, projection, options)
      .exec();

    if (!doc) return null;

    return doc;
  }

  async findOne(
    filter: FilterQuery<M>,
    projection?: { [K in keyof M]?: number },
    options?: QueryOptions,
  ): Promise<M | null> {
    const doc = await this.repository.findOne(filter, projection, options);

    if (!doc) return null;

    return doc;
  }

  async find(
    filter: FilterQuery<M>,
    projection?: { [K in keyof M]?: number },
    options?: QueryOptions,
  ): Promise<M[]> {
    return await this.repository.find(filter, projection, options).exec();
  }

  async create(payload: Partial<M>, options?: SaveOptions): Promise<M> {
    const newModel = new this.repository(payload);
    return (await newModel.save(options)) as M;
  }

  async update(
    id: string,
    payload: Partial<M>,
    options?: SaveOptions,
  ): Promise<M> {
    const doc = await this.repository.findOne({ _id: id }).exec();

    if (!doc) throw new DocumentNotFoundError();

    Object.keys(payload).forEach((key) => {
      doc[key] = payload[key];
    });
    return (await doc.save(options)) as M;
  }

  async delete(id: string): Promise<boolean> {
    const doc = await this.repository
      .findOne({
        _id: id,
      })
      .exec();

    if (!doc) throw new DocumentNotFoundError();

    const result = await this.repository.findOneAndDelete({ _id: id }).exec();

    return !!result;
  }

  async count(filter: FilterQuery<M>, cb?: Callback<number>): Promise<number> {
    const countResult = await this.repository.countDocuments(filter, cb);
    return countResult.valueOf();
  }
}
