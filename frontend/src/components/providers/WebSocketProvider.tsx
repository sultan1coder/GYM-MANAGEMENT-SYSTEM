import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { toast } from "react-hot-toast";
import config from "@/config/environment";

interface WebSocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  sendMessage: (message: any) => void;
  subscribe: (event: string, callback: (data: any) => void) => void;
  unsubscribe: (event: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [eventCallbacks, setEventCallbacks] = useState<
    Map<string, (data: any) => void>
  >(new Map());

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket(config.WEBSOCKET_URL);

    ws.onopen = () => {
      setIsConnected(true);
      setSocket(ws);
      console.log("🔗 WebSocket connected");
      toast.success("Real-time updates connected");
    };

    ws.onclose = () => {
      setIsConnected(false);
      setSocket(null);
      console.log("🔌 WebSocket disconnected");
      toast.error("Real-time updates disconnected");
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
      toast.error("Real-time connection error");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const { type, payload } = data;

        // Call registered callback for this event type
        const callback = eventCallbacks.get(type);
        if (callback) {
          callback(payload);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = (message: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket not connected");
    }
  };

  const subscribe = (event: string, callback: (data: any) => void) => {
    setEventCallbacks((prev) => new Map(prev.set(event, callback)));
  };

  const unsubscribe = (event: string) => {
    setEventCallbacks((prev) => {
      const newMap = new Map(prev);
      newMap.delete(event);
      return newMap;
    });
  };

  const value = {
    socket,
    isConnected,
    sendMessage,
    subscribe,
    unsubscribe,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
