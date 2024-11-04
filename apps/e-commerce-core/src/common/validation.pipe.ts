import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';
import { ERROR_TYPE } from '@app/contracts/error/error-types';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(reqBody: any) {
    const result = this.schema.safeParse(reqBody);
    if (result.error)
      throw new BadRequestException(ERROR_TYPE.ZOD, {
        cause: result.error,
      });
    return result.data;
  }
}
