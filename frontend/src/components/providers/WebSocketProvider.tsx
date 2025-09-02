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
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [eventCallbacks, setEventCallbacks] = useState<
    Map<string, (data: any) => void>
  >(new Map());

  useEffect(() => {
    // Only try WebSocket if feature is enabled
    if (!config.FEATURES.WEBSOCKET_ENABLED) {
      console.log("🔌 WebSocket disabled in configuration");
      return;
    }

    // Initialize WebSocket connection with retry logic
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(config.WEBSOCKET_URL);

        ws.onopen = () => {
          setIsConnected(true);
          setSocket(ws);
          setConnectionAttempts(0);
          console.log("🔗 WebSocket connected");

          // Show success toast only on first successful connection
          if (connectionAttempts > 0) {
            toast.success("Real-time updates reconnected");
          }
        };

        ws.onclose = () => {
          setIsConnected(false);
          setSocket(null);
          console.log("🔌 WebSocket disconnected");

          // Only attempt reconnect if we haven't tried too many times
          if (connectionAttempts < 5) {
            setTimeout(() => {
              console.log(
                `🔄 Attempting WebSocket reconnection... (${
                  connectionAttempts + 1
                }/5)`
              );
              setConnectionAttempts((prev) => prev + 1);
              connectWebSocket();
            }, Math.min(5000 * (connectionAttempts + 1), 30000)); // Exponential backoff, max 30s
          } else {
            console.log("🚫 Max WebSocket reconnection attempts reached");
            toast.error(
              "Real-time updates unavailable. Dashboard will work in offline mode."
            );
          }
        };

        ws.onerror = (error) => {
          console.error("❌ WebSocket error:", error);
          setIsConnected(false);
          setSocket(null);

          // Only show error toast after multiple failed attempts
          if (connectionAttempts >= 2) {
            toast.error("Connection issues with real-time updates");
          }
        };

        return ws;
      } catch (error) {
        console.error("❌ Failed to create WebSocket connection:", error);
        setIsConnected(false);
        return null;
      }
    };

    const ws = connectWebSocket();

    if (ws) {
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
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };
    }
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
