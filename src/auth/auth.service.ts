import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(email: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.usersService.createUser(email, passwordHash);
    const { refreshToken } = await this.setRefreshToken(user.id);
    const accessToken = this.issueAccessToken(user);
    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, role: user.role.name },
    };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmailWithAuth(email);
    if (!user?.auth) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.auth.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const { refreshToken } = await this.setRefreshToken(user.id);
    const accessToken = this.issueAccessToken(user);
    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, role: user.role.name },
    };
  }

  async refresh(refreshToken: string) {
    const auth = await this.prisma.auth.findFirst({
      where: {
        refreshToken,
        refreshTokenExpiresAt: { gt: new Date() },
      },
      include: { user: { include: { role: true } } },
    });
    if (!auth)
      throw new UnauthorizedException('Invalid or expired refresh token');
    const user = auth.user as {
      id: string;
      email: string;
      role: { name: string };
    };
    const { refreshToken: newRefreshToken } = await this.setRefreshToken(
      user.id,
    );
    const accessToken = this.issueAccessToken(user);
    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: { id: user.id, email: user.email, role: user.role.name },
    };
  }

  async logout(refreshToken: string) {
    await this.prisma.auth.updateMany({
      where: { refreshToken },
      data: { refreshToken: null, refreshTokenExpiresAt: null },
    });
  }

  private async setRefreshToken(userId: string) {
    const refreshToken = crypto.randomBytes(32).toString('hex');
    const refreshTokenExpiresAt = new Date(
      Date.now() + REFRESH_TOKEN_EXPIRY_MS,
    );
    await this.prisma.auth.update({
      where: { userId },
      data: { refreshToken, refreshTokenExpiresAt },
    });
    return { refreshToken, refreshTokenExpiresAt };
  }

  private issueAccessToken(user: {
    id: string;
    email: string;
    role: { name: string };
  }) {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role.name,
    });
  }
}
