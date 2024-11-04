import { PipeTransform, Injectable } from '@nestjs/common';
import { ZodSchema } from 'zod';
import { ERROR_TYPE } from '@app/contracts/error/error-types';
import CustomRpcException from '@app/contracts/error/CustomRpcException';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(reqBody: any) {
    const result = this.schema.safeParse(reqBody);
    if (result.error)
      throw new CustomRpcException({
        code: ERROR_TYPE.ZOD,
        validation: result.error,
      });
    return result.data;
  }
}
