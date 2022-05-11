import { HttpException, HttpStatus } from '@nestjs/common';

export class TokenExpiredException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'auth token expired',
        error: 'TokenExpired',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
