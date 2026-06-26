"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = initializeSocket;
exports.getIO = getIO;
exports.emitToRole = emitToRole;
exports.emitToUser = emitToUser;
exports.emitToFloor = emitToFloor;
exports.emitToTable = emitToTable;
exports.emitToKitchen = emitToKitchen;
exports.emitToCustomerDisplay = emitToCustomerDisplay;
exports.emitToAll = emitToAll;
const socket_io_1 = require("socket.io");
const jwt_1 = require("../utils/jwt");
const connectedUsers = new Map();
let ioInstance = null;
function initializeSocket(httpServer) {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
            credentials: true,
        },
    });
    ioInstance = io;
    globalThis.io = io;
    io.use((socket, next) => {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return next(new Error('Authentication required'));
        }
        try {
            const payload = (0, jwt_1.verifyToken)(token);
            socket.user = payload;
            next();
        }
        catch {
            next(new Error('Invalid token'));
        }
    });
    io.on('connection', (socket) => {
        const userId = socket.user.userId;
        const role = socket.user.role;
        if (!connectedUsers.has(userId)) {
            connectedUsers.set(userId, new Set());
        }
        connectedUsers.get(userId).add(socket.id);
        socket.join(`role:${role}`);
        socket.join(`user:${userId}`);
        console.log(`Socket connected: ${socket.id} (user: ${userId}, role: ${role})`);
        socket.on('join:floor', (floorId) => {
            socket.join(`floor:${floorId}`);
        });
        socket.on('leave:floor', (floorId) => {
            socket.leave(`floor:${floorId}`);
        });
        socket.on('join:table', (tableId) => {
            socket.join(`table:${tableId}`);
        });
        socket.on('leave:table', (tableId) => {
            socket.leave(`table:${tableId}`);
        });
        socket.on('join:kitchen', () => {
            socket.join('kitchen:all');
        });
        socket.on('leave:kitchen', () => {
            socket.leave('kitchen:all');
        });
        socket.on('join:customer-display', (orderId) => {
            socket.join(`customer-display:${orderId}`);
        });
        socket.on('leave:customer-display', (orderId) => {
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
function getIO() {
    return ioInstance;
}
function emitToRole(role, event, data) {
    const io = getIO();
    io?.to(`role:${role}`).emit(event, data);
}
function emitToUser(userId, event, data) {
    const io = getIO();
    io?.to(`user:${userId}`).emit(event, data);
}
function emitToFloor(floorId, event, data) {
    const io = getIO();
    io?.to(`floor:${floorId}`).emit(event, data);
}
function emitToTable(tableId, event, data) {
    const io = getIO();
    io?.to(`table:${tableId}`).emit(event, data);
}
function emitToKitchen(event, data) {
    const io = getIO();
    io?.to('kitchen:all').emit(event, data);
}
function emitToCustomerDisplay(orderId, event, data) {
    const io = getIO();
    io?.to(`customer-display:${orderId}`).emit(event, data);
}
function emitToAll(event, data) {
    const io = getIO();
    io?.emit(event, data);
}
//# sourceMappingURL=index.js.map