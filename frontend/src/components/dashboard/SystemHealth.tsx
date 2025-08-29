import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Database,
  Server,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { useSystemHealth } from "../providers/SystemHealthProvider";

interface SystemHealthProps {
  onRefresh?: () => void;
  showDetails?: boolean;
}

const SystemHealth: React.FC<SystemHealthProps> = ({
  onRefresh,
  showDetails = true,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Use consolidated system health provider
  const { systemHealth, isLoading, error, refetch, acknowledgeAlert } =
    useSystemHealth();

  const handleRefresh = async () => {
    await refetch();
    if (onRefresh) {
      onRefresh();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600";
      case "good":
        return "text-blue-600";
      case "warning":
        return "text-yellow-600";
      case "critical":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "good":
        return <Activity className="h-4 w-4 text-blue-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      case "stable":
        return <Minus className="h-4 w-4 text-gray-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">
              Loading system health...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
            <p>Error loading system health: {error}</p>
            <Button onClick={handleRefresh} className="mt-4">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!systemHealth) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <Database className="mx-auto h-12 w-12 mb-4" />
            <p>No system health data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Health Overview
          </CardTitle>
          <CardDescription>
            Real-time monitoring of system performance and resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {getStatusIcon(systemHealth.overallStatus)}
              <span
                className={`font-medium ${getStatusColor(
                  systemHealth.overallStatus
                )}`}
              >
                Overall Status:{" "}
                {systemHealth.overallStatus.charAt(0).toUpperCase() +
                  systemHealth.overallStatus.slice(1)}
              </span>
            </div>
            <Button onClick={handleRefresh} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* System Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-600">Uptime</div>
              <div className="text-lg font-bold">{systemHealth.uptime}</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-600">
                Last Backup
              </div>
              <div className="text-lg font-bold">
                {systemHealth.lastBackup.toLocaleDateString()}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-600">
                Next Backup
              </div>
              <div className="text-lg font-bold">
                {systemHealth.nextBackup.toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* System Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemHealth.metrics.map((metric) => (
              <Card
                key={metric.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      {metric.name}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(metric.trend)}
                      {getStatusIcon(metric.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    {metric.value}
                    {metric.unit}
                  </div>
                  <Progress
                    value={metric.value}
                    className="mb-2"
                    style={
                      {
                        "--progress-color":
                          metric.status === "critical"
                            ? "#ef4444"
                            : metric.status === "warning"
                            ? "#f59e0b"
                            : metric.status === "good"
                            ? "#3b82f6"
                            : "#10b981",
                      } as React.CSSProperties
                    }
                  />
                  <div className="text-xs text-gray-500">
                    {metric.description}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Last updated: {metric.lastUpdated.toLocaleTimeString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      {systemHealth.alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              System Alerts
            </CardTitle>
            <CardDescription>
              Active system notifications and warnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemHealth.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    alert.resolved
                      ? "bg-gray-50 border-gray-200"
                      : alert.type === "critical"
                      ? "bg-red-50 border-red-200"
                      : alert.type === "warning"
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        alert.resolved
                          ? "bg-gray-400"
                          : alert.type === "critical"
                          ? "bg-red-500"
                          : alert.type === "warning"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          alert.resolved ? "text-gray-600" : "text-gray-900"
                        }`}
                      >
                        {alert.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {alert.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!alert.resolved && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => acknowledgeAlert(alert.id)}
                    >
                      Acknowledge
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20">
              <div className="text-center">
                <Database className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Backup System</div>
              </div>
            </Button>
            <Button variant="outline" className="h-20">
              <div className="text-center">
                <Server className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Restart Services</div>
              </div>
            </Button>
            <Button variant="outline" className="h-20">
              <div className="text-center">
                <Activity className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-medium">View Logs</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemHealth;
