import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../common/jwt/jwt.payload';
import * as config from 'config';
const jwtConfig = config.get('jwt');

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  public async createAccessToken(payload: JwtPayload) {
    try {
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: jwtConfig.accessTokenSecret,
        expiresIn: jwtConfig.expiresIn,
      });
      return accessToken;
    } catch (error) {
      throw new InternalServerErrorException('server error');
    }
  }

  public async createRefreshToken(payload: JwtPayload) {
    try {
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: jwtConfig.refreshTokenSecret,
        expiresIn: jwtConfig.expiresIn,
      });
      return refreshToken;
    } catch (err) {
      throw new InternalServerErrorException('server error');
    }
  }
}
