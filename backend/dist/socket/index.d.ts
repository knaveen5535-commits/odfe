import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
export declare function initializeSocket(httpServer: HttpServer): Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export declare function getIO(): Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any> | null;
export declare function emitToRole(role: string, event: string, data: unknown): void;
export declare function emitToUser(userId: string, event: string, data: unknown): void;
export declare function emitToFloor(floorId: string, event: string, data: unknown): void;
export declare function emitToTable(tableId: string, event: string, data: unknown): void;
export declare function emitToKitchen(event: string, data: unknown): void;
export declare function emitToCustomerDisplay(orderId: string, event: string, data: unknown): void;
export declare function emitToAll(event: string, data: unknown): void;
declare global {
    var io: ReturnType<typeof initializeSocket> | undefined;
}
//# sourceMappingURL=index.d.ts.map