import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { toast } from "react-hot-toast";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  XCircle,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info" | "system";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  persistent?: boolean;
  actions?: NotificationAction[];
  data?: any;
}

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  showToast: (
    message: string,
    type?: "success" | "error" | "warning" | "info"
  ) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem("gym-notifications");
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        const notificationsWithDates = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
        setNotifications(notificationsWithDates);
      } catch (error) {
        console.error("Error loading notifications:", error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("gym-notifications", JSON.stringify(notifications));
  }, [notifications]);

  // WebSocket connection for real-time notifications
  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout;
    let isConnecting = false;

    const connectWebSocket = () => {
      if (isConnecting) return;
      isConnecting = true;

      try {
        const ws = new WebSocket("ws://localhost:4001");

        ws.onopen = () => {
          console.log("WebSocket connected to notifications server");
          setSocket(ws);
          isConnecting = false;

          // Subscribe to notification events
          ws.send(
            JSON.stringify({
              type: "subscribe",
              payload: {
                events: [
                  "notification",
                  "member_stats",
                  "system_health",
                  "new_member",
                  "new_payment",
                ],
              },
            })
          );
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            // Handle different message types
            if (
              data.type === "notification" ||
              data.type === "new_member" ||
              data.type === "new_payment"
            ) {
              addNotification({
                type:
                  data.type === "notification"
                    ? data.payload?.notificationType || "info"
                    : "success",
                title:
                  data.type === "notification"
                    ? data.payload?.title || "New Notification"
                    : data.type === "new_member"
                    ? "New Member Joined"
                    : "Payment Received",
                message:
                  data.type === "notification"
                    ? data.payload?.message || ""
                    : data.type === "new_member"
                    ? `Welcome ${data.payload?.memberName || "new member"}!`
                    : `Payment of $${data.payload?.amount || "0"} received`,
                persistent: data.payload?.persistent || false,
                actions: data.payload?.actions || [],
                data: data.payload?.data,
              });
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        ws.onclose = (event) => {
          console.log("WebSocket disconnected:", event.code, event.reason);
          setSocket(null);
          isConnecting = false;

          // Only attempt to reconnect if it wasn't a manual close and not a 1006 error
          if (event.code !== 1000 && event.code !== 1006) {
            console.log("Attempting to reconnect in 5 seconds...");
            reconnectTimeout = setTimeout(connectWebSocket, 5000);
          } else if (event.code === 1006) {
            console.log(
              "WebSocket connection closed abnormally. Check if backend server is running on port 4001."
            );
          }
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          isConnecting = false;
        };

        // Set a timeout to detect connection failures
        const connectionTimeout = setTimeout(() => {
          if (ws.readyState === WebSocket.CONNECTING) {
            console.log(
              "WebSocket connection timeout. Make sure the backend server is running on port 4001."
            );
            ws.close();
            isConnecting = false;
          }
        }, 10000); // 10 second timeout

        ws.addEventListener("open", () => {
          clearTimeout(connectionTimeout);
        });
      } catch (error) {
        console.error("Failed to create WebSocket connection:", error);
        isConnecting = false;
        // Retry after 5 seconds
        reconnectTimeout = setTimeout(connectWebSocket, 5000);
      }
    };

    // Only attempt connection if we're in a browser environment
    if (typeof window !== "undefined") {
      connectWebSocket();
    }

    return () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (socket) {
        socket.close(1000, "Component unmounting");
      }
    };
  }, []);

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
      const newNotification: Notification = {
        ...notification,
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        read: false,
      };

      setNotifications((prev) => [newNotification, ...prev]);

      // Show toast for non-persistent notifications
      if (!notification.persistent) {
        const toastMessage = `${notification.title}: ${notification.message}`;
        switch (notification.type) {
          case "success":
            toast.success(toastMessage);
            break;
          case "error":
            toast.error(toastMessage);
            break;
          case "warning":
            toast(toastMessage, { icon: "⚠️" });
            break;
          case "info":
            toast(toastMessage, { icon: "ℹ️" });
            break;
          default:
            toast(toastMessage);
        }
      }
    },
    []
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const showToast = useCallback(
    (
      message: string,
      type: "success" | "error" | "warning" | "info" = "info"
    ) => {
      switch (type) {
        case "success":
          toast.success(message);
          break;
        case "error":
          toast.error(message);
          break;
        case "warning":
          toast(message, { icon: "⚠️" });
          break;
        case "info":
          toast(message, { icon: "ℹ️" });
          break;
      }
    },
    []
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    showToast,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Notification Icon Component
export const NotificationIcon: React.FC<{ type: Notification["type"] }> = ({
  type,
}) => {
  const iconClass = "w-4 h-4";

  switch (type) {
    case "success":
      return <CheckCircle className={cn(iconClass, "text-green-600")} />;
    case "error":
      return <XCircle className={cn(iconClass, "text-red-600")} />;
    case "warning":
      return <AlertTriangle className={cn(iconClass, "text-yellow-600")} />;
    case "info":
      return <Info className={cn(iconClass, "text-blue-600")} />;
    case "system":
      return <Bell className={cn(iconClass, "text-gray-600")} />;
    default:
      return <Bell className={cn(iconClass, "text-gray-600")} />;
  }
};

// Notification Item Component
export const NotificationItem: React.FC<{
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
}> = ({ notification, onMarkAsRead, onRemove }) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <Card className={cn(
        "transition-all duration-200 hover:shadow-md",
        !notification.read && "border-l-4 border-l-blue-500 bg-blue-50/50"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <NotificationIcon type={notification.type} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className={cn(
                  "font-medium text-sm",
                  !notification.read && "font-semibold"
                )}
              >
                {notification.title}
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {formatTime(notification.timestamp)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(notification.id)} className="h-6 w-6 p-0 hover:bg-gray-200"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
            {notification.actions && notification.actions.length > 0 && (
              <div className="flex gap-2 mt-3">
                {notification.actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || "outline"}
                    size="sm"
                    onClick={action.action} className="h-7 text-xs"
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
