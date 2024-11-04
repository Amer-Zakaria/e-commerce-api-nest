import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ERROR_TYPE } from '@app/contracts/error/error-types';
import CustomRpcException from '@app/contracts/error/CustomRpcException';

@Injectable()
export class CheckUniquenessService {
  constructor() {}

  async check(
    model: Model<any>,
    nameOfProperty: string,
    value: string,
    id?: string,
  ) {
    const document = await model.findOne({
      [nameOfProperty as any]: value,
    });

    if (!document) return;
    else if (document._id.toString() === id) return; //for update requests

    throw new CustomRpcException({
      code: ERROR_TYPE.DUPLICATION,
      message: `"${nameOfProperty}" is not unique, "${value}" is already exist.`,
    });
  }
}
