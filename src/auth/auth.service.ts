import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signInUser(phoneNumber: string, password: string) {
    const user = await this.usersService.findOne(phoneNumber);
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = { phoneNumber: phoneNumber, userId: user?.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUpUser(phoneNumber: string, password: string) {
    const user = await this.usersService.findOne(phoneNumber);
    if (user) {
      return 'user already exists';
    }
    return await this.usersService.create({
      phoneNumber: phoneNumber,
      password: password,
    });
  }
}
