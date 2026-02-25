import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { Role } from './enums/role.enum';

export type UserWithRole = User & { role: { name: string } };

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateRole(name: Role) {
    const role = await this.prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    return role;
  }

  async createUser(
    email: string,
    passwordHash: string,
    roleName: Role = Role.User,
  ): Promise<UserWithRole> {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email already registered');
    const role = await this.getOrCreateRole(roleName);
    const user = await this.prisma.user.create({
      data: {
        email,
        roleId: role.id,
        auth: {
          create: { passwordHash },
        },
      },
      include: { role: true },
    });
    return user as UserWithRole;
  }

  async findByEmailWithAuth(
    email: string,
  ): Promise<(UserWithRole & { auth: { passwordHash: string } }) | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true, auth: true },
    });
    return user as (UserWithRole & { auth: { passwordHash: string } }) | null;
  }
}
