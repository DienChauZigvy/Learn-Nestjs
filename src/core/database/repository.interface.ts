import mongoose, {
  Model as MongooseModel,
  PipelineStage,
  Aggregate,
  Callback,
  FilterQuery,
  Schema,
} from 'mongoose';
import mongodb = require('mongodb');

export type SaveOptions = mongoose.SaveOptions;
export type InsertManyOptions = mongoose.InsertManyOptions;
export type QueryOptions = mongoose.QueryOptions;
export type BulkWriteOptions = mongodb.BulkWriteOptions;
export type AggregateOptions = mongodb.AggregateOptions;

export type Model<M> = MongooseModel<M & Document> & { accessibleBy?: any };

export interface IRepository<M> {
  context: Model<M>;
  schema: Schema<M>;

  findById(
    id: string,
    projection?: { [K in keyof M]?: number },
    options?: QueryOptions,
  ): Promise<M | null>;

  findOne(
    filter: FilterQuery<M>,
    projection?: { [K in keyof M]?: number },
    options?: QueryOptions,
  ): Promise<M | null>;

  find(
    filter: FilterQuery<M>,
    projection?: { [K in keyof M]?: number },
    options?: QueryOptions,
  ): Promise<M[]>;

  create<C>(payload: C, options?: SaveOptions): Promise<M>;

  update<U>(id: string, payload: U, options?: SaveOptions): Promise<M>;

  delete(id: string, hard?: boolean, options?: SaveOptions): Promise<boolean>;

  count(filter: FilterQuery<M>, cb?: Callback<number>): Promise<number>;
}
