import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from 'src/users/repositories/users.repository';
import { PushService } from './push.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsersRepository])],
  providers: [PushService],
  exports: [PushService],
})
export class PushModule {}
