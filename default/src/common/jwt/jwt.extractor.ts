import { Request } from 'express';
import { JwtFromRequestFunction } from 'passport-jwt';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';

export const jwtAccessExtractor: JwtFromRequestFunction = (
  request: Request,
): string | null => {
  try {
    const accessToken = request.header('Authorization').split(' ')[1];
    return accessToken;
  } catch (error) {
    throw new UnauthorizedException('not authenticated');
  }
};

export const jwtRefreshExtractor: JwtFromRequestFunction = (
  request: Request,
): string | null => {
  try {
    const refreshToken = request.body.refreshToken;
    return refreshToken;
  } catch (error) {
    throw new ForbiddenException('not authenticated');
  }
};
