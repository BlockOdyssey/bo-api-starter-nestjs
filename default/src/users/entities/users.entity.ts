import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoute } from '../users.constants';

@Entity('TB_USER')
export class Users {
  @PrimaryGeneratedColumn({ comment: '사용자 인덱스' })
  id: number;

  @Column('varchar', { length: 50, unique: true, comment: '사용자 이메일' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column('varchar', { length: 300, comment: '사용자 비밀번호' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Column('varchar', { length: 50, comment: '사용자 이름' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @Column('varchar', { length: 20, unique: true, comment: '사용자 전화번호' })
  @Matches(/^01[0179][0-9]{7,8}$/, { message: 'Wrong phone number' })
  @IsString()
  @IsNotEmpty()
  phoneNum: string;

  @Column('varchar', { length: 50, unique: true, comment: '사용자 닉네임' })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @Column('text', { comment: '내 소개', nullable: true })
  @IsString()
  @IsOptional()
  description: string;

  @Column('varchar', { length: 200, comment: '프로필 이미지', nullable: true })
  @IsString()
  @IsOptional()
  profileImg: string;

  @Column('enum', {
    enum: UserRoute,
    comment: `가입 경로 (${Object.values(UserRoute)})`,
    default: UserRoute.Email,
  })
  @IsEnum(UserRoute)
  @IsNotEmpty()
  userRoute: string;

  @Column('varchar', { length: 300, comment: 'Access Token', nullable: true })
  @IsString()
  @IsOptional()
  accessToken: string;

  @Column('varchar', { length: 300, comment: 'Refresh Token', nullable: true })
  @IsString()
  @IsOptional()
  refreshToken: string;

  @Column('varchar', { length: 300, comment: 'Push Token', nullable: true })
  @IsString()
  @IsOptional()
  pushToken: string;

  @CreateDateColumn({ comment: '가입일시' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '수정일시' })
  updatedAt: Date;

  @DeleteDateColumn({ comment: '삭제일시' })
  deletedAt: Date;
}
