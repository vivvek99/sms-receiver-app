'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message } from '@/types';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';

interface UseSocketReturn {
  isConnected: boolean;
  lastMessage: Message | null;
  error: string | null;
}

export function useSocket(phoneNumberId?: string): UseSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<Message | null>(null);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      setError(null);
      
      // Subscribe to specific phone number if provided
      if (phoneNumberId) {
        socket.emit('subscribe', { phoneNumberId });
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('new_message', (message: Message) => {
      setLastMessage(message);
    });

    socket.on('error', (err: string) => {
      setError(err);
    });

    socket.on('connect_error', (err) => {
      setError(`Connection error: ${err.message}`);
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [phoneNumberId]);

  return { isConnected, lastMessage, error };
}

export function useMessages(phoneNumberId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const { isConnected, lastMessage, error } = useSocket(phoneNumberId);

  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => {
      // Check if message already exists
      if (prev.some((m) => m.id === message.id)) {
        return prev;
      }
      return [message, ...prev];
    });
  }, []);

  useEffect(() => {
    if (lastMessage) {
      addMessage(lastMessage);
    }
  }, [lastMessage, addMessage]);

  const setInitialMessages = useCallback((initialMessages: Message[]) => {
    setMessages(initialMessages);
  }, []);

  return {
    messages,
    isConnected,
    error,
    addMessage,
    setInitialMessages,
  };
}
