import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { ERROR_TYPE } from '@app/contracts/error/error-types';

@Injectable()
export class CheckExistenceService {
  constructor() {}

  async check<T>(model: Model<T>, id: string): Promise<T> {
    const document = await model.findById(id);

    if (!document)
      throw new NotFoundException(ERROR_TYPE.NOT_FOUND, {
        cause: `Object with the id "${id}" is not found.`,
      });

    return document;
  }
}
