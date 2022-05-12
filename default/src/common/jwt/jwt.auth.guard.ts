import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredException } from '../exceptions/token-expired.exception';

@Injectable()
export class JwtAccessAuthGuard extends AuthGuard('jwt-access') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      if (info && info.message === 'jwt expired') {
        throw new TokenExpiredException();
      } else {
        throw err || new UnauthorizedException('not valid access token');
      }
    }
    return user;
  }
}

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      if (info && info.message === 'jwt expired') {
        throw new TokenExpiredException();
      } else {
        throw err || new ForbiddenException('not valid refresh token');
      }
    }
    return user;
  }
}
