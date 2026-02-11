import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'generated/prisma/client';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');
    const passwordMatch = await bcrypt.compare(password, user.password || '');
    if (!passwordMatch) throw new UnauthorizedException('Wrong password');
    return user;
  }

  async login(user: User) {
    const { id, email } = user;
    return {
      id,
      email,
      token: this.jwtService.sign({ id, email }),
    };
  }

  async register(dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  async googleAuth(email: string) {
    const user = await this.userService.findByEmail(email);
    if (user) return this.jwtService.sign({ id: user.id, email });
    return this.userService.create({ email });
  }
}
