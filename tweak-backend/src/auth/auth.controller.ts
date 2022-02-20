import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { GetUser } from './get-user.decorator';
import { User } from './schema/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signupWithUsernamePassword(createUserDto);
  }

  @Post('sign-in')
  async signin(@Body() userDto: UserDto) {
    return this.authService.loginWithUsernamePassword(userDto);
  }

  @Get('is-auth')
  @UseGuards(AuthGuard())
  async isAuthenticated(@GetUser() user: User) {
    return `${user.username}! you are authorized!`;
  }
}
