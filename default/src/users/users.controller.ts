import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import {
  JwtAccessAuthGuard,
  JwtRefreshAuthGuard,
} from 'src/common/jwt/jwt.auth.guard';
import { CreateUserRequestDto } from './dtos/create-user-request.dto';
import { CreateUserResponseDto } from './dtos/create-user-response.dto';
import { LoginRequestDto } from './dtos/login-request.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async userLogin(
    @Body() loginInfo: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const loginResult = await this.usersService.userLogin(loginInfo);
    res.cookie('refreshToken', loginResult.refreshToken);
    return { ...loginResult, refreshToken: undefined };
  }

  @Post('join')
  async joinUser(
    @Body() userInfo: CreateUserRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CreateUserResponseDto> {
    const joinResult = await this.usersService.joinUser(userInfo);
    res.cookie('refreshToken', joinResult.refreshToken);
    return { ...joinResult, refreshToken: undefined };
  }

  @UseGuards(JwtAccessAuthGuard)
  @Post('logout')
  async userLogout() {
    return this.usersService.userLogout();
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('token')
  async getNewAccessToken() {
    return this.usersService.getNewAccessToken();
  }

  @UseGuards(JwtAccessAuthGuard)
  @Get('info')
  async getUserInfo() {
    return this.usersService.getUserInfo();
  }
}
