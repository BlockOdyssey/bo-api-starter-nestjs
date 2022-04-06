import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
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

  // 토큰 검증
  private async verifyAccessToken(accessToken: string): Promise<any> {
    return this.jwtService.verifyAsync(accessToken, {
      secret: jwtConfig.accessTokenSecret,
    });
  }

  // get token
  private async checkAccessToken(accessToken: string) {
    return accessToken && accessToken.includes('Bearer ')
      ? accessToken.split('Bearer ')[1]
      : undefined;
  }

  public async parseAuthorization(authorization: string): Promise<void> {
    try {
      const token = await this.checkAccessToken(authorization);

      // 토큰 검증 실패
      if (!token) {
        throw new UnauthorizedException('not found token');
      }

      const payload = await this.verifyAccessToken(token);

      if (payload.exp < new Date().getTime() / 1000 - 10) {
        throw new UnauthorizedException('token expired');
      }

      return payload;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
