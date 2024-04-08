import { FilterQuery, Query } from 'mongoose';
import { BaseModel, IBaseModel, IFilter } from '../dto';
import { IRepository, QueryOptions } from '../database';

export interface IFilterStage {
  $match: object;
}

export type Projection<M> = {
  [K in keyof M]?: number;
};

export interface IRequestInfo {
  controllerInfo: any;
}

export abstract class BaseService<M extends BaseModel> {
  constructor(protected repository: IRepository<M>) {}

  async findById(id: string): Promise<M> {
    const filter: IFilter = {
      column: '_id',
      eq: id,
    };

    return this.repository.findById(id);
  }
}
