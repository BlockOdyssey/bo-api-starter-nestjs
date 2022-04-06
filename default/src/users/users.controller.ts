import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import {
  JwtAccessAuthGuard,
  JwtRefreshAuthGuard,
} from 'src/common/jwt/jwt.auth.guard';
import { CreateUserRequestDto } from './dtos/create-user-request.dto';
import { CreateUserResponseDto } from './dtos/create-user-response.dto';
import { LoginRequestDto } from './dtos/login-request.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { Users } from './entities/users.entity';
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

  @Post('logout')
  @UseGuards(JwtAccessAuthGuard)
  @HttpCode(200)
  async userLogout(
    @CurrentUser() user: Users,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.usersService.userLogout(user);
    res.clearCookie('refreshToken');
    return;
  }

  @Post('token')
  @UseGuards(JwtRefreshAuthGuard)
  async getNewAccessToken(@CurrentUser() user: Users) {
    const updateResult = await this.usersService.getNewAccessToken(user);
    return { accessToken: updateResult.accessToken };
  }

  @Get('info')
  @UseGuards(JwtAccessAuthGuard)
  async getUserInfo() {
    return this.usersService.getUserInfo();
  }
}
