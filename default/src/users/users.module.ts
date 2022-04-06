import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import {
  JwtAccessStrategy,
  JwtRefreshStrategy,
} from 'src/common/jwt/jwt.strategy';
import { UsersRepository } from './repositories/users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersRepository]),
    forwardRef(() => AuthModule),
  ],
  providers: [UsersService, JwtAccessStrategy, JwtRefreshStrategy],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
