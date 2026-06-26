import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verifyToken, TokenPayload } from '../utils/jwt';

interface AuthenticatedSocket extends Socket {
  user?: TokenPayload;
}

const connectedUsers = new Map<string, Set<string>>();

let ioInstance: Server | null = null;

export function initializeSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
    },
  });

  ioInstance = io;
  globalThis.io = io;

  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      const payload = verifyToken(token);
      socket.user = payload;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.user!.userId;
    const role = socket.user!.role;

    if (!connectedUsers.has(userId)) {
      connectedUsers.set(userId, new Set());
    }
    connectedUsers.get(userId)!.add(socket.id);

    socket.join(`role:${role}`);
    socket.join(`user:${userId}`);

    console.log(`Socket connected: ${socket.id} (user: ${userId}, role: ${role})`);

    socket.on('join:floor', (floorId: string) => {
      socket.join(`floor:${floorId}`);
    });

    socket.on('leave:floor', (floorId: string) => {
      socket.leave(`floor:${floorId}`);
    });

    socket.on('join:table', (tableId: string) => {
      socket.join(`table:${tableId}`);
    });

    socket.on('leave:table', (tableId: string) => {
      socket.leave(`table:${tableId}`);
    });

    socket.on('join:kitchen', () => {
      socket.join('kitchen:all');
    });

    socket.on('leave:kitchen', () => {
      socket.leave('kitchen:all');
    });

    socket.on('join:customer-display', (orderId: string) => {
      socket.join(`customer-display:${orderId}`);
    });

    socket.on('leave:customer-display', (orderId: string) => {
      socket.leave(`customer-display:${orderId}`);
    });

    socket.on('disconnect', () => {
      const userSockets = connectedUsers.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          connectedUsers.delete(userId);
        }
      }
      console.log(`Socket disconnected: ${socket.id} (user: ${userId})`);
    });
  });

  return io;
}

export function getIO() {
  return ioInstance;
}

export function emitToRole(role: string, event: string, data: unknown) {
  const io = getIO();
  io?.to(`role:${role}`).emit(event, data);
}

export function emitToUser(userId: string, event: string, data: unknown) {
  const io = getIO();
  io?.to(`user:${userId}`).emit(event, data);
}

export function emitToFloor(floorId: string, event: string, data: unknown) {
  const io = getIO();
  io?.to(`floor:${floorId}`).emit(event, data);
}

export function emitToTable(tableId: string, event: string, data: unknown) {
  const io = getIO();
  io?.to(`table:${tableId}`).emit(event, data);
}

export function emitToKitchen(event: string, data: unknown) {
  const io = getIO();
  io?.to('kitchen:all').emit(event, data);
}

export function emitToCustomerDisplay(orderId: string, event: string, data: unknown) {
  const io = getIO();
  io?.to(`customer-display:${orderId}`).emit(event, data);
}

export function emitToAll(event: string, data: unknown) {
  const io = getIO();
  io?.emit(event, data);
}

declare global {
  var io: ReturnType<typeof initializeSocket> | undefined;
}