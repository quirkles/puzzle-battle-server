import { Body, Controller, Get, Post } from '@nestjs/common';
import { v4 } from 'uuid';
import { RedisCacheRepository, UserEntity } from './services';

@Controller()
export class AppController {
  constructor(private readonly cacheRepository: RedisCacheRepository) {}

  @Get('/allUsers')
  async findAllUsers(): Promise<UserEntity[]> {
    return await this.cacheRepository.getAll('User');
  }

  @Post('/user')
  async addUser(@Body() createUser: UserEntity): Promise<UserEntity> {
    const user: UserEntity = {
      ...createUser,
      id: v4(),
    };
    await this.cacheRepository.setOne(user, 'User');
    return user;
  }
}
