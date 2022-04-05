import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from '../config/typeorm.config';
import { AppController } from './app.controller';

@Module({
  imports: [TypeOrmModule.forRoot(typeormConfig)],
  controllers: [AppController],
})
export class AppModule {}
