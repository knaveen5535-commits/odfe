'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { getAccessToken } from '@/utils/token';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

interface UseSocketOptions {
  autoConnect?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export function useSocket(options: UseSocketOptions = {}) {
  const { autoConnect = true, onConnect, onDisconnect, onError } = options;
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const token = getAccessToken();
    if (!token) {
      setError(new Error('No access token available'));
      return;
    }

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socket.on('connect', () => {
      setIsConnected(true);
      setError(null);
      onConnect?.();
    });

    socket.on('disconnect', (reason) => {
      setIsConnected(false);
      onDisconnect?.();
      console.log('Socket disconnected:', reason);
    });

    socket.on('connect_error', (err) => {
      setError(err);
      setIsConnected(false);
      onError?.(err);
    });

    socketRef.current = socket;
  }, [onConnect, onDisconnect, onError]);

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
    socketRef.current = null;
    setIsConnected(false);
  }, []);

  const emit = useCallback((event: string, data: unknown) => {
    socketRef.current?.emit(event, data);
  }, []);

  const on = useCallback(<T extends unknown[]>(event: string, callback: (...args: T) => void) => {
    (socketRef.current?.on as (event: string, callback: (...args: T) => void) => void)(event, callback);
    return () => {
      (socketRef.current?.off as (event: string, callback: (...args: T) => void) => void)(event, callback);
    };
  }, []);

  const off = useCallback(<T extends unknown[]>(event: string, callback?: (...args: T) => void) => {
    (socketRef.current?.off as (event: string, callback?: (...args: T) => void) => void)(event, callback);
  }, []);

  const joinRoom = useCallback((room: string) => {
    socketRef.current?.emit('join', room);
  }, []);

  const leaveRoom = useCallback((room: string) => {
    socketRef.current?.emit('leave', room);
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    socket: socketRef.current,
    isConnected,
    error,
    connect,
    disconnect,
    emit,
    on,
    off,
    joinRoom,
    leaveRoom,
  };
}

export function useSocketEvent<T extends unknown[]>(event: string, callback: (...args: T) => void) {
  const { on, off } = useSocket({ autoConnect: true });

  useEffect(() => {
    const cleanup = on(event, callback);
    return cleanup;
  }, [event, callback, on, off]);
}

export function useTableStatus(tableId: string) {
  const [status, setStatus] = useState<string>('AVAILABLE');
  const { on, off } = useSocket({ autoConnect: true });

  useEffect(() => {
    if (!tableId) return;

    const handleStatusUpdate = (data: { tableId: string; status: string }) => {
      if (data.tableId === tableId) {
        setStatus(data.status);
      }
    };

    const cleanup = on('table:status', handleStatusUpdate);
    return cleanup;
  }, [tableId, on, off]);

  return status;
}

export function useKitchenOrders() {
  const [orders, setOrders] = useState<unknown[]>([]);
  const { on, off } = useSocket({ autoConnect: true });

  useEffect(() => {
    const handleNewOrder = (data: unknown) => {
      setOrders(prev => [data, ...prev]);
    };

    const handleOrderUpdate = (data: { id: string; status: string }) => {
      setOrders(prev => prev.map(o => 
        (o as { id: string }).id === data.id ? { ...(o as Record<string, unknown>), status: data.status } : o
      ));
    };

    const handleOrderRemoved = (data: { id: string }) => {
      setOrders(prev => prev.filter(o => (o as { id: string }).id !== data.id));
    };

    const cleanup1 = on('kitchen:new-order', handleNewOrder);
    const cleanup2 = on('kitchen:order-update', handleOrderUpdate);
    const cleanup3 = on('kitchen:order-removed', handleOrderRemoved);

    return () => {
      cleanup1();
      cleanup2();
      cleanup3();
    };
  }, [on, off]);

  return orders;
}

export function useCustomerDisplay(orderId: string) {
  const [order, setOrder] = useState<unknown | null>(null);
  const { on, off, joinRoom, leaveRoom } = useSocket({ autoConnect: true });

  useEffect(() => {
    if (!orderId) return;

    joinRoom(`customer-display:${orderId}`);

    const handleOrderUpdate = (data: unknown) => {
      setOrder(data);
    };

    const cleanup = on('customer-display:update', handleOrderUpdate);
    return () => {
      cleanup();
      leaveRoom(`customer-display:${orderId}`);
    };
  }, [orderId, on, off, joinRoom, leaveRoom]);

  return order;
}

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<unknown | null>(null);
  const { on, off } = useSocket({ autoConnect: true });

  useEffect(() => {
    const handleMetricsUpdate = (data: unknown) => {
      setMetrics(data);
    };

    const cleanup = on('dashboard:metrics', handleMetricsUpdate);
    return cleanup;
  }, [on, off]);

  return metrics;
}

export function useFloorTables(floorId: string) {
  const [tables, setTables] = useState<unknown[]>([]);
  const { on, off, joinRoom, leaveRoom } = useSocket({ autoConnect: true });

  useEffect(() => {
    if (!floorId) return;

    joinRoom(`floor:${floorId}`);

    const handleTableUpdate = (data: { tableId: string; status: string; orderId?: string }) => {
      setTables(prev => {
        const index = prev.findIndex(t => (t as { id: string }).id === data.tableId);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = { ...(updated[index] as Record<string, unknown>), status: data.status, orderId: data.orderId };
          return updated;
        }
        return prev;
      });
    };

    const handleTableAdded = (data: unknown) => {
      setTables(prev => [...prev, data]);
    };

    const handleTableRemoved = (data: { id: string }) => {
      setTables(prev => prev.filter(t => (t as { id: string }).id !== data.id));
    };

    const cleanup1 = on('floor:table-update', handleTableUpdate);
    const cleanup2 = on('floor:table-added', handleTableAdded);
    const cleanup3 = on('floor:table-removed', handleTableRemoved);

    return () => {
      cleanup1();
      cleanup2();
      cleanup3();
      leaveRoom(`floor:${floorId}`);
    };
  }, [floorId, on, off, joinRoom, leaveRoom]);

  return tables;
}