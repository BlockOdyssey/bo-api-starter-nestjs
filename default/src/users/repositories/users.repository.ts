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

  async getUserCreateResult(id: number): Promise<Users> {
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

  async getUserInfo(id: number): Promise<Users> {
    return this.findOne(
      { id },
      {
        select: [
          'email',
          'username',
          'phoneNum',
          'nickname',
          'userRoute',
          'description',
          'profileImg',
          'createdAt',
        ],
      },
    );
  }

  async deleteUser(id: number): Promise<void> {
    await this.update({ id }, { accessToken: null, refreshToken: null });
    await this.softRemove({ id });
    return;
  }
}
