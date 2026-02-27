import { UseGuards } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WsJwtGuard } from '../auth/guards';

export const SCHEDULE_EVENTS = {
  created: 'schedule:created',
  updated: 'schedule:updated',
  deleted: 'schedule:deleted',
} as const;

@WebSocketGateway({
  cors: { origin: true },
  namespace: '/schedules',
})
@UseGuards(WsJwtGuard)
export class SchedulesGateway {
  @WebSocketServer()
  server!: Server;

  emitCreated(schedule: Record<string, unknown>): void {
    this.server.emit(SCHEDULE_EVENTS.created, schedule);
  }

  emitUpdated(schedule: Record<string, unknown>): void {
    this.server.emit(SCHEDULE_EVENTS.updated, schedule);
  }

  emitDeleted(id: string): void {
    this.server.emit(SCHEDULE_EVENTS.deleted, { id });
  }
}
