import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUpUser(
      createUserDto.phoneNumber,
      createUserDto.password,
    );
  }

  @Post('login')
  async signIn(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.signInUser(
      createUserDto.phoneNumber,
      createUserDto.password,
    );
    return user;
  }
}
