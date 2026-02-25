import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RequestUser } from './interfaces';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.usersService.createUser(email, passwordHash);
    return this.issueToken(user);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmailWithAuth(email);
    if (!user?.auth) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.auth.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return this.issueToken(user);
  }

  private issueToken(user: {
    id: string;
    email: string;
    role: { name: string };
  }) {
    const payload: RequestUser = {
      id: user.id,
      email: user.email,
      role: user.role.name,
    };
    const accessToken = this.jwtService.sign({
      sub: payload.id,
      email: payload.email,
      role: payload.role,
    });
    return { accessToken, user: payload };
  }
}
