import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Server,
  Shield,
  Zap,
  Clock,
} from "lucide-react";
import { useSystemHealth } from "../providers/SystemHealthProvider";

const SystemHealth: React.FC = () => {
  const { systemHealth, refetch } = useSystemHealth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
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
        return <Zap className="h-4 w-4 text-green-600" />;
      case "down":
        return <Zap className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  if (!systemHealth) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-gray-500">
            <p>Loading system health...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            System Health
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon(systemHealth.overallStatus)}
            <div>
              <h3 className="font-medium">Overall Status</h3>
              <p className="text-sm text-gray-600">
                System is running {systemHealth.overallStatus}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(systemHealth.overallStatus)}>
            {systemHealth.overallStatus}
          </Badge>
        </div>

        {/* System Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Uptime</span>
            </div>
            <p className="text-2xl font-bold">{systemHealth.uptime}</p>
            <p className="text-sm text-gray-600">System running time</p>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="font-medium">Last Backup</span>
            </div>
            <p className="text-2xl font-bold">N/A</p>
            <p className="text-sm text-gray-600">Database backup status</p>
          </div>
        </div>

        {/* Metrics */}
        <div>
          <h3 className="font-medium mb-3">System Metrics</h3>
          <div className="space-y-3">
            {systemHealth.metrics?.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getTrendIcon(metric.trend)}
                  <span className="font-medium">{metric.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">{metric.value}</p>
                  <p className="text-sm text-gray-600">{metric.unit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        {systemHealth.alerts && systemHealth.alerts.length > 0 && (
          <div>
            <h3 className="font-medium mb-3">Active Alerts</h3>
            <div className="space-y-2">
              {systemHealth.alerts
                .filter((alert) => !alert.resolved)
                .map((alert, index) => (
                  <div
                    key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="font-medium">{alert.message}</span>
                    </div>
                    <Badge variant="destructive">{alert.type}</Badge>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h3 className="font-medium mb-3">Quick Actions</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              View Logs
            </Button>
            <Button variant="outline" size="sm">
              Run Diagnostics
            </Button>
            <Button variant="outline" size="sm">
              Backup Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealth;
