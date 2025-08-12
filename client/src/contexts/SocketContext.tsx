import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  sendMessage: (recipientId: string, message: string) => void;
  joinCamp: (campId: string) => void;
  leaveCamp: (campId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io('http://localhost:5000', {
        auth: {
          token: localStorage.getItem('token'),
        },
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        newSocket.emit('join', user.id);
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      newSocket.on('new-message', (data) => {
        // Handle new message notification
        console.log('New message received:', data);
      });

      newSocket.on('new-notification', (notification) => {
        // Handle new notification
        console.log('New notification:', notification);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [isAuthenticated, user]);

  const sendMessage = (recipientId: string, message: string) => {
    if (socket && user) {
      socket.emit('send-message', {
        recipientId,
        message,
        senderId: user.id,
      });
    }
  };

  const joinCamp = (campId: string) => {
    if (socket) {
      socket.emit('join-camp', campId);
    }
  };

  const leaveCamp = (campId: string) => {
    if (socket) {
      socket.emit('leave-camp', campId);
    }
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    sendMessage,
    joinCamp,
    leaveCamp,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};