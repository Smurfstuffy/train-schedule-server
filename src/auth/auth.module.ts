import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard, RolesGuard, WsJwtGuard } from './guards';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) throw new Error('JWT_SECRET is required');
        return { secret, signOptions: { expiresIn: '30m' } };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard, WsJwtGuard],
  exports: [JwtModule, JwtAuthGuard, RolesGuard, WsJwtGuard],
})
export class AuthModule {}
