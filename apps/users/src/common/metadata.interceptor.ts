import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class MetadataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rpcContext = context.switchToRpc();
    const data = rpcContext.getData();

    if (data && data.metadata) {
      // Attach metadata to the RPC context for global access
      rpcContext.getContext().metadata = data.metadata;
    }

    // Pass only the inner payload to the handler
    rpcContext.getData = () => data.payload;

    return next.handle().pipe(map((response) => response));
  }
}
