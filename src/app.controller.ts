import { Body, Controller, Get, Post } from '@nestjs/common';
import { v4 } from 'uuid';
import { LiveUserRepository } from './services';
import { Entities } from './models';

@Controller()
export class AppController {
  constructor(private readonly liveUserRepository: LiveUserRepository) {}

  @Get('/allUsers')
  async findAllUsers(): Promise<Entities['User'][]> {
    return await this.liveUserRepository.getAll();
  }

  @Post('/user')
  async addUser(
    @Body() createUser: Entities['User'],
  ): Promise<Entities['User']> {
    return this.liveUserRepository.addUser({
      ...createUser,
      id: v4(),
    });
  }
}
