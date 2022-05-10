import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { getReasonPhrase } from 'http-status-codes';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> | Promise<Observable<Response<T>>> {
    const response = context.switchToHttp().getResponse();
    const { statusCode } = response;
    const message = getReasonPhrase(statusCode);
    return next.handle().pipe(
      map((data) => {
        return { statusCode, message, data };
      }),
    );
  }
}
