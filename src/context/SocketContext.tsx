import { io, Socket } from "socket.io-client";
import { createContext, type ReactNode as ComponentChildren } from "react";
import { useContext, useEffect, useState } from "react";

interface SocketContextProps {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextProps>({
  socket: null,
  isConnected: false,
});

interface SocketProviderProps {
  children: ComponentChildren;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_BACKEND_URL || "", {
      autoConnect: true,
      transports: ["websocket", "polling"],
    });
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): Socket | null => {
  const context = useContext(SocketContext);
  return context.socket;
};

export const useSocketStatus = (): boolean => {
  const context = useContext(SocketContext);
  return context.isConnected;
};
