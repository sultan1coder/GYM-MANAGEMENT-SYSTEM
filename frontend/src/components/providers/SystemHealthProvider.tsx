import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import toast from "react-hot-toast";

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: "excellent" | "good" | "warning" | "critical";
  trend: "up" | "down" | "stable";
  threshold: {
    warning: number;
    critical: number;
  };
  description: string;
  lastUpdated: Date;
}

interface SystemHealth {
  overallStatus: "excellent" | "good" | "warning" | "critical";
  metrics: SystemMetric[];
  uptime: string;
  lastBackup: Date;
  nextBackup: Date;
  alerts: Array<{
    id: string;
    type: "info" | "warning" | "error" | "critical";
    message: string;
    timestamp: Date;
    resolved: boolean;
  }>;
}

interface SystemHealthContextType {
  systemHealth: SystemHealth | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  acknowledgeAlert: (alertId: string) => void;
}

const SystemHealthContext = createContext<SystemHealthContextType | undefined>(
  undefined
);

export const useSystemHealth = () => {
  const context = useContext(SystemHealthContext);
  if (!context) {
    throw new Error(
      "useSystemHealth must be used within a SystemHealthProvider"
    );
  }
  return context;
};

interface SystemHealthProviderProps {
  children: ReactNode;
}

export const SystemHealthProvider: React.FC<SystemHealthProviderProps> = ({
  children,
}) => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSystemHealth = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock system metrics - replace with actual API calls
      const mockMetrics: SystemMetric[] = [
        {
          id: "cpu",
          name: "CPU Usage",
          value: Math.floor(Math.random() * 60) + 20, // 20-80%
          unit: "%",
          status: "good",
          trend: "stable",
          threshold: { warning: 70, critical: 90 },
          description: "Central Processing Unit utilization",
          lastUpdated: new Date(),
        },
        {
          id: "memory",
          name: "Memory Usage",
          value: Math.floor(Math.random() * 50) + 30, // 30-80%
          unit: "%",
          status: "good",
          trend: "up",
          threshold: { warning: 80, critical: 95 },
          description: "Random Access Memory utilization",
          lastUpdated: new Date(),
        },
        {
          id: "disk",
          name: "Disk Usage",
          value: Math.floor(Math.random() * 30) + 50, // 50-80%
          unit: "%",
          status: "warning",
          trend: "up",
          threshold: { warning: 75, critical: 90 },
          description: "Storage disk space utilization",
          lastUpdated: new Date(),
        },
        {
          id: "network",
          name: "Network Latency",
          value: Math.floor(Math.random() * 50) + 10, // 10-60ms
          unit: "ms",
          status: "excellent",
          trend: "stable",
          threshold: { warning: 100, critical: 200 },
          description: "Network response time",
          lastUpdated: new Date(),
        },
        {
          id: "database",
          name: "Database Connections",
          value: Math.floor(Math.random() * 20) + 5, // 5-25
          unit: "connections",
          status: "good",
          trend: "stable",
          threshold: { warning: 30, critical: 50 },
          description: "Active database connections",
          lastUpdated: new Date(),
        },
      ];

      // Calculate overall status based on metrics
      const overallStatus = mockMetrics.every((m) => m.status === "excellent")
        ? "excellent"
        : mockMetrics.some((m) => m.status === "critical")
        ? "critical"
        : mockMetrics.some((m) => m.status === "warning")
        ? "warning"
        : "good";

      // Mock uptime
      const uptime = "15 days, 8 hours, 32 minutes";

      // Mock backup information
      const lastBackup = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago
      const nextBackup = new Date(Date.now() + 6 * 60 * 60 * 1000); // 6 hours from now

      // Mock alerts
      const alerts = [
        {
          id: "1",
          type: "warning" as const,
          message: "Disk usage is approaching threshold",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          resolved: false,
        },
        {
          id: "2",
          type: "info" as const,
          message: "System backup completed successfully",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          resolved: true,
        },
      ];

      const health: SystemHealth = {
        overallStatus,
        metrics: mockMetrics,
        uptime,
        lastBackup,
        nextBackup,
        alerts,
      };

      setSystemHealth(health);
    } catch (error) {
      console.error("Failed to fetch system health:", error);
      setError("Failed to load system health");
      toast.error("Failed to load system health");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemHealth();

    // Set up interval to refresh system health every 30 seconds
    const interval = setInterval(fetchSystemHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  const refetch = async () => {
    await fetchSystemHealth();
  };

  const acknowledgeAlert = (alertId: string) => {
    if (systemHealth) {
      setSystemHealth({
        ...systemHealth,
        alerts: systemHealth.alerts.map((alert) =>
          alert.id === alertId ? { ...alert, resolved: true } : alert
        ),
      });
    }
  };

  const value: SystemHealthContextType = {
    systemHealth,
    isLoading,
    error,
    refetch,
    acknowledgeAlert,
  };

  return (
    <SystemHealthContext.Provider value={value}>
      {children}
    </SystemHealthContext.Provider>
  );
};
