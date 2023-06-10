import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const initialTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const diffTime = Date.now() - initialTime;

        const { url, method } = context.switchToHttp().getRequest();

        console.log(
          `Execucão levou: ${diffTime} millisegundos, url: ${url}, method: ${method}`,
        );
      }),
    );
  }
}
