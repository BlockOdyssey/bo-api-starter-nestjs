import { EntityRepository, Repository } from 'typeorm';
import { Users } from '../entities/users.entity';

@EntityRepository(Users)
export class UsersRepository extends Repository<Users> {
  async userLogin(email: string): Promise<Users> {
    return this.findOne({ email }, { select: ['id', 'password'] });
  }

  async checkEmailDuplicates(email: string): Promise<boolean> {
    const result = await this.count({ email });
    return result > 0;
  }

  async checkPhoneNumDuplicates(phoneNum: string): Promise<boolean> {
    const result = await this.count({ phoneNum });
    return result > 0;
  }

  async getUserResult(id: number): Promise<Users> {
    return this.findOne(
      { id },
      {
        select: [
          'email',
          'username',
          'phoneNum',
          'nickname',
          'userRoute',
          'accessToken',
          'refreshToken',
        ],
      },
    );
  }
}
