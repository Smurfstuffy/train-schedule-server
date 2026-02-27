import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsArgumentsHost } from '@nestjs/common/interfaces';
import type { Socket } from 'socket.io';
import type { JwtPayload } from '../interfaces';
import type { RequestUser } from '../interfaces';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const wsContext: WsArgumentsHost = context.switchToWs();
    const client = wsContext.getClient<Socket>();
    const token = this.getTokenFromHandshake(client);
    if (!token) {
      throw new UnauthorizedException('Missing or invalid token');
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      const user: RequestUser = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };
      client.data.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private getTokenFromHandshake(client: Socket): string | null {
    const auth = client.handshake.auth as { token?: string };
    if (auth?.token && typeof auth.token === 'string') {
      return auth.token;
    }
    const header = client.handshake.headers.authorization;
    if (typeof header === 'string' && header.startsWith('Bearer ')) {
      return header.slice(7);
    }
    return null;
  }
}
