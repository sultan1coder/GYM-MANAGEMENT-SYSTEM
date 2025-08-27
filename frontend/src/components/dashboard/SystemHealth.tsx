import React, { useState, useEffect } from "react";
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

interface SystemHealthProps {
  metrics?: SystemMetric[];
  onRefresh?: () => void;
  showDetails?: boolean;
}

const SystemHealth: React.FC<SystemHealthProps> = ({
  metrics = [],
  onRefresh,
  showDetails = true,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Mock system metrics - replace with actual API calls
  const mockMetrics: SystemMetric[] = [
    {
      id: "cpu",
      name: "CPU Usage",
      value: 45,
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
      value: 62,
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
      value: 78,
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
      value: 25,
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
      value: 85,
      unit: "",
      status: "good",
      trend: "stable",
      threshold: { warning: 90, critical: 100 },
      description: "Active database connections",
      lastUpdated: new Date(),
    },
    {
      id: "api",
      name: "API Response Time",
      value: 180,
      unit: "ms",
      status: "warning",
      trend: "up",
      threshold: { warning: 150, critical: 300 },
      description: "Average API response time",
      lastUpdated: new Date(),
    },
  ];

  const dataToUse = metrics.length > 0 ? metrics : mockMetrics;

  useEffect(() => {
    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      // Update mock data with slight variations
      // In real implementation, this would fetch from API
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600 dark:text-green-400";
      case "good":
        return "text-blue-600 dark:text-blue-400";
      case "warning":
        return "text-yellow-600 dark:text-yellow-400";
      case "critical":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 dark:bg-green-900/20";
      case "good":
        return "bg-blue-100 dark:bg-blue-900/20";
      case "warning":
        return "bg-yellow-100 dark:bg-yellow-900/20";
      case "critical":
        return "bg-red-100 dark:bg-red-900/20";
      default:
        return "bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      case "stable":
        return <Minus className="w-4 h-4 text-gray-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getProgressColor = (metric: SystemMetric) => {
    const { value, threshold } = metric;
    if (value >= threshold.critical) return "bg-red-500";
    if (value >= threshold.warning) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getOverallHealth = () => {
    const criticalCount = dataToUse.filter(
      (m) => m.status === "critical"
    ).length;
    const warningCount = dataToUse.filter((m) => m.status === "warning").length;

    if (criticalCount > 0) return "critical";
    if (warningCount > 0) return "warning";
    return "excellent";
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    // Simulate refresh delay
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const overallHealth = getOverallHealth();
  const criticalMetrics = dataToUse.filter((m) => m.status === "critical");
  const warningMetrics = dataToUse.filter((m) => m.status === "warning");

  return (
    <div className="space-y-6">
      {/* Overall System Health */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>System Health Overview</span>
                <Badge
                  className={`ml-2 ${getStatusBgColor(
                    overallHealth
                  )} ${getStatusColor(overallHealth)}`}
                >
                  {overallHealth.toUpperCase()}
                </Badge>
              </CardTitle>
              <CardDescription>
                Real-time system performance monitoring
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {
                  dataToUse.filter(
                    (m) => m.status === "excellent" || m.status === "good"
                  ).length
                }
              </div>
              <div className="text-sm text-green-600">Healthy</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {warningMetrics.length}
              </div>
              <div className="text-sm text-yellow-600">Warning</div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {criticalMetrics.length}
              </div>
              <div className="text-sm text-red-600">Critical</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dataToUse.map((metric) => (
          <Card
            key={metric.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedMetric === metric.id ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() =>
              setSelectedMetric(selectedMetric === metric.id ? null : metric.id)
            }
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  {metric.name}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(metric.trend)}
                  <Badge
                    className={`text-xs ${getStatusBgColor(
                      metric.status
                    )} ${getStatusColor(metric.status)}`}
                  >
                    {metric.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {metric.value}
                    {metric.unit}
                  </span>
                  <div className="text-xs text-gray-500">
                    {metric.lastUpdated.toLocaleTimeString()}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Current</span>
                    <span>
                      {metric.value}
                      {metric.unit}
                    </span>
                  </div>
                  <Progress
                    value={metric.value}
                    className="h-2"
                    style={
                      {
                        "--progress-color": getProgressColor(metric),
                      } as React.CSSProperties
                    }
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>
                      Warning: {metric.threshold.warning}
                      {metric.unit}
                    </span>
                    <span>
                      Critical: {metric.threshold.critical}
                      {metric.unit}
                    </span>
                  </div>
                </div>

                {selectedMetric === metric.id && (
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {metric.description}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                      <span>Last updated:</span>
                      <span>{metric.lastUpdated.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Critical Alerts */}
      {(criticalMetrics.length > 0 || warningMetrics.length > 0) && (
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <span>System Alerts</span>
            </CardTitle>
            <CardDescription>
              Issues requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalMetrics.map((metric) => (
                <div
                  key={metric.id}
                  className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-red-800 dark:text-red-200">
                        {metric.name} - CRITICAL
                      </h4>
                      <p className="text-sm text-red-600 dark:text-red-400">
                        Current: {metric.value}
                        {metric.unit} | Threshold: {metric.threshold.critical}
                        {metric.unit}
                      </p>
                    </div>
                    <Badge className="bg-red-600 text-white">Critical</Badge>
                  </div>
                </div>
              ))}

              {warningMetrics.map((metric) => (
                <div
                  key={metric.id}
                  className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                        {metric.name} - WARNING
                      </h4>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">
                        Current: {metric.value}
                        {metric.unit} | Threshold: {metric.threshold.warning}
                        {metric.unit}
                      </p>
                    </div>
                    <Badge className="bg-yellow-600 text-white">Warning</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Performance Trends</span>
          </CardTitle>
          <CardDescription>
            System performance over the last 24 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">CPU & Memory</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>CPU Usage</span>
                  <span className="text-green-600">45%</span>
                </div>
                <Progress value={45} className="h-2" />

                <div className="flex items-center justify-between text-sm">
                  <span>Memory Usage</span>
                  <span className="text-blue-600">62%</span>
                </div>
                <Progress value={62} className="h-2" />
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Storage & Network</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Disk Usage</span>
                  <span className="text-yellow-600">78%</span>
                </div>
                <Progress value={78} className="h-2" />

                <div className="flex items-center justify-between text-sm">
                  <span>Network Latency</span>
                  <span className="text-green-600">25ms</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemHealth;
