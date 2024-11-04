import { RpcException } from '@nestjs/microservices';
import { XOR } from 'libs/interfaces/XOR';
import { ERROR_TYPE } from './error-types';

export default class CustomRpcException extends RpcException {
  constructor(
    error: { code: ERROR_TYPE; status?: number } & XOR<
      { message: string },
      { validation: object }
    >,
  ) {
    super(error);
  }
}
