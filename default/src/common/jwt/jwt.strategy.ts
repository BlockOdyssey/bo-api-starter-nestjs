import { JwtPayload } from './jwt.payload';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { jwtAccessExtractor, jwtRefreshExtractor } from './jwt.extractor';
import { UsersService } from '../../users/users.service';
import * as config from 'config';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from 'src/users/repositories/users.repository';
const jwtConfig = config.get('jwt');

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([jwtAccessExtractor]),
      secretOrKey: jwtConfig.accessTokenSecret,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req, payload: JwtPayload) {
    const accessToken = req.headers['authorization'].split(' ')[1];
    const user = await this.checkUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('not exist user');
    }

    const storedAccessToken = await this.checkAccessToken(
      payload.sub,
      accessToken,
    );
    if (!storedAccessToken) {
      throw new UnauthorizedException('not match access token');
    }

    return user;
  }

  async checkAccessToken(id: number, token: string) {
    const tokenCheck = await this.usersRepository.count({
      id,
      accessToken: token,
    });
    if (tokenCheck > 0) {
      return true;
    } else {
      return false;
    }
  }

  async checkUserById(id: number) {
    const userCheck = await this.usersRepository.count({ id });
    if (userCheck > 0) {
      return true;
    } else {
      return false;
    }
  }
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([jwtRefreshExtractor]),
      secretOrKey: jwtConfig.refreshTokenSecret,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req, payload: JwtPayload) {
    const refreshToken = req.cookies.refreshToken;
    const user = await this.checkUserById(payload.sub);

    if (!user) {
      throw new ForbiddenException('not exist user');
    }

    const storedRefreshToken = await this.checkRefreshToken(
      payload.sub,
      refreshToken,
    );
    if (!storedRefreshToken) {
      throw new ForbiddenException('not match refresh token');
    }

    return user;
  }

  async checkRefreshToken(id: number, token: string) {
    const tokenCheck = await this.usersRepository.count({
      id,
      refreshToken: token,
    });
    if (tokenCheck > 0) {
      return true;
    } else {
      return false;
    }
  }

  async checkUserById(id: number) {
    const userCheck = await this.usersRepository.count({ id });
    if (userCheck > 0) {
      return true;
    } else {
      return false;
    }
  }
}
