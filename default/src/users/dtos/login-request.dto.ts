import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRoute } from '../users.constants';

export class LoginRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRoute)
  @IsNotEmpty()
  userRoute: string;

  @IsString()
  @IsNotEmpty()
  pushToken: string;
}
