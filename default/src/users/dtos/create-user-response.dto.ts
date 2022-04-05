import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { UserRoute } from '../users.constants';

export class CreateUserResponseDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @Matches(/^01[0179][0-9]{7,8}$/, { message: 'Wrong phone number' })
  @IsString()
  @IsNotEmpty()
  phoneNum: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsEnum(UserRoute)
  @IsNotEmpty()
  userRoute: string;

  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
