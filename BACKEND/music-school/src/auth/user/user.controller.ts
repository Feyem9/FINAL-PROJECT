import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/interfaces/user.interface';
import { UserDto } from 'src/DTO/userDto';
// import { User } from 'src/schema/user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: UserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }
}