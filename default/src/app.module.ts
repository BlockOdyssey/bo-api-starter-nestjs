import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from '../config/typeorm.config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeormConfig), AuthModule, UsersModule],
  controllers: [AppController],
})
export class AppModule {}
