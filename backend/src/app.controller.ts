import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import { UserDocument } from './users/schemas/user.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly usersService: UsersService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto) as UserDocument;
    return {
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }
}
