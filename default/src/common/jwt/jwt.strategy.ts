import { JwtPayload } from './jwt.payload';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { jwtAccessExtractor, jwtRefreshExtractor } from './jwt.extractor';
import * as config from 'config';
import { UsersService } from '../../users/users.service';
const jwtConfig = config.get('jwt');

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([jwtAccessExtractor]),
      secretOrKey: jwtConfig.accessTokenSecret,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req, payload: JwtPayload) {
    const accessToken = req.headers['authorization'].split(' ')[1];
    const user = await this.usersService.getUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('not exist user');
    }

    if (accessToken !== user.accessToken) {
      throw new UnauthorizedException('not match access token');
    }

    return user;
  }
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([jwtRefreshExtractor]),
      secretOrKey: jwtConfig.refreshTokenSecret,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req, payload: JwtPayload) {
    const refreshToken = req.body.refreshToken;
    const user = await this.usersService.getUserById(payload.sub);

    if (!user) {
      throw new ForbiddenException('not exist user');
    }

    if (refreshToken !== user.refreshToken) {
      throw new ForbiddenException('not match refresh token');
    }

    return user;
  }
}
