import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
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
  @HttpCode(200)
  async userLogin(
    @Body() loginInfo: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    return await this.usersService.userLogin(loginInfo);
  }

  @Post('join')
  async joinUser(
    @Body() userInfo: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    return await this.usersService.joinUser(userInfo);
  }

  @Post('logout')
  @UseGuards(JwtAccessAuthGuard)
  @HttpCode(200)
  async userLogout(@CurrentUser() user: Users): Promise<void> {
    await this.usersService.userLogout(user);
    return;
  }

  @Post('token')
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(200)
  async getNewAccessToken(@CurrentUser() user: Users): Promise<Object> {
    const updateResult = await this.usersService.getNewAccessToken(user);
    return { accessToken: updateResult.accessToken };
  }

  @Get('info')
  @UseGuards(JwtAccessAuthGuard)
  async getUserInfo(@CurrentUser() user: Users): Promise<Users> {
    return this.usersService.getUserInfo(user);
  }

  @Delete('leave')
  @UseGuards(JwtAccessAuthGuard)
  @HttpCode(200)
  async userLeave(@CurrentUser() user: Users): Promise<void> {
    await this.usersService.userLeave(user);
    return;
  }
}
