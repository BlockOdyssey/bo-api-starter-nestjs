import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserRequestDto } from './dtos/create-user-request.dto';
import { CreateUserResponseDto } from './dtos/create-user-response.dto';
import { LoginRequestDto } from './dtos/login-request.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { UsersRepository } from './repositories/users.repository';
const bcrypt = require('bcrypt');
const saltRounds = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
  ) {}

  async userLogin(loginInfo: LoginRequestDto): Promise<LoginResponseDto> {
    const loginResult = await this.usersRepository.userLogin(loginInfo.email);
    if (!loginResult) throw new ConflictException('wrong email address');

    const checkPassword = await bcrypt.compare(
      loginInfo.password,
      loginResult.password,
    );
    if (checkPassword) {
      const tokenPayload = { sub: loginResult.id };
      const accessToken = await this.authService.createAccessToken(
        tokenPayload,
      );
      const refreshToken = await this.authService.createRefreshToken(
        tokenPayload,
      );

      await this.usersRepository.update(
        { id: loginResult.id },
        { accessToken, refreshToken },
      );

      return await this.usersRepository.getUserResult(loginResult.id);
    } else {
      throw new ConflictException('wrong password');
    }
  }

  async joinUser(
    userInfo: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    const checkEmail = await this.usersRepository.checkEmailDuplicates(
      userInfo.email,
    );
    if (checkEmail) throw new ConflictException('email address duplicates');

    const checkPhoneNum = await this.usersRepository.checkPhoneNumDuplicates(
      userInfo.phoneNum,
    );
    if (checkPhoneNum) throw new ConflictException('phone number duplicates');

    const newPassword = await bcrypt.hashSync(userInfo.password, saltRounds);
    const createResult = await this.usersRepository.save({
      ...userInfo,
      password: newPassword,
    });

    const tokenPayload = { sub: createResult.id };
    const accessToken = await this.authService.createAccessToken(tokenPayload);
    const refreshToken = await this.authService.createRefreshToken(
      tokenPayload,
    );

    await this.usersRepository.update(
      { id: createResult.id },
      { accessToken, refreshToken },
    );

    return await this.usersRepository.getUserResult(createResult.id);
  }

  async userLogout() {}

  async getNewAccessToken() {}

  async getUserInfo() {}
}
