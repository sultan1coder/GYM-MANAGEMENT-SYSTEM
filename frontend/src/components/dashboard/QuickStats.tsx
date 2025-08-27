import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserCheck,
  Dumbbell,
  CreditCard,
  TrendingUp,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
} from "lucide-react";

interface QuickStatsProps {
  stats: {
    totalUsers: number;
    totalMembers: number;
    totalEquipment: number;
    totalPayments: number;
    pendingPayments: number;
    systemHealth: "excellent" | "good" | "warning" | "critical";
    todayRevenue: number;
    activeMemberships: number;
    maintenanceAlerts: number;
    expiringMemberships: number;
  };
}

const QuickStats: React.FC<QuickStatsProps> = ({ stats }) => {
  const getSystemHealthColor = (health: string) => {
    switch (health) {
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

  const getSystemHealthIcon = (health: string) => {
    switch (health) {
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

  const getSystemHealthDescription = (health: string) => {
    switch (health) {
      case "excellent":
        return "All systems operational";
      case "good":
        return "Minor issues detected";
      case "warning":
        return "Attention required";
      case "critical":
        return "Immediate action needed";
      default:
        return "Status unknown";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Users */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            Admin & Staff accounts
          </p>
          <div className="mt-2">
            <Badge variant="outline" className="text-xs">
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Total Members */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalMembers}</div>
          <p className="text-xs text-muted-foreground">Active gym members</p>
          <div className="mt-2 flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {stats.activeMemberships} Active
            </Badge>
            {stats.expiringMemberships > 0 && (
              <Badge
                variant="secondary"
                className="text-xs text-yellow-700 bg-yellow-100"
              >
                {stats.expiringMemberships} Expiring
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Today's Revenue */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            ${stats.todayRevenue.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">Daily earnings</p>
          <div className="mt-2 flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {stats.totalPayments} Payments
            </Badge>
            {stats.pendingPayments > 0 && (
              <Badge
                variant="secondary"
                className="text-xs text-yellow-700 bg-yellow-100"
              >
                {stats.pendingPayments} Pending
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Health</CardTitle>
          {getSystemHealthIcon(stats.systemHealth)}
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold capitalize ${getSystemHealthColor(
              stats.systemHealth
            )}`}
          >
            {stats.systemHealth}
          </div>
          <p className="text-xs text-muted-foreground">
            {getSystemHealthDescription(stats.systemHealth)}
          </p>
          <div className="mt-2">
            <Badge
              variant="outline"
              className={`text-xs ${getSystemHealthColor(stats.systemHealth)}`}
            >
              {stats.maintenanceAlerts > 0
                ? `${stats.maintenanceAlerts} Alerts`
                : "All Clear"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Status */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Equipment Status
          </CardTitle>
          <Dumbbell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalEquipment}</div>
          <p className="text-xs text-muted-foreground">Total equipment items</p>
          <div className="mt-2">
            <Badge variant="outline" className="text-xs">
              Operational
            </Badge>
            {stats.maintenanceAlerts > 0 && (
              <Badge
                variant="secondary"
                className="text-xs text-yellow-700 bg-yellow-100 ml-2"
              >
                {stats.maintenanceAlerts} Maintenance
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Overview */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Payment Overview
          </CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPayments}</div>
          <p className="text-xs text-muted-foreground">Total transactions</p>
          <div className="mt-2 flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              ${stats.todayRevenue.toFixed(2)} Today
            </Badge>
            {stats.pendingPayments > 0 && (
              <Badge
                variant="secondary"
                className="text-xs text-yellow-700 bg-yellow-100"
              >
                <Clock className="w-3 h-3 mr-1" />
                {stats.pendingPayments} Pending
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Memberships */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Memberships
          </CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.activeMemberships}
          </div>
          <p className="text-xs text-muted-foreground">Current memberships</p>
          <div className="mt-2 flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {((stats.activeMemberships / stats.totalMembers) * 100).toFixed(
                1
              )}
              % Active
            </Badge>
            {stats.expiringMemberships > 0 && (
              <Badge
                variant="secondary"
                className="text-xs text-yellow-700 bg-yellow-100"
              >
                <Clock className="w-3 h-3 mr-1" />
                {stats.expiringMemberships} Expiring
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Summary */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            Ready
          </div>
          <p className="text-xs text-muted-foreground">
            All systems accessible
          </p>
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span>Users:</span>
              <Badge variant="outline" className="text-xs">
                Manage
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Equipment:</span>
              <Badge variant="outline" className="text-xs">
                Monitor
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Payments:</span>
              <Badge variant="outline" className="text-xs">
                Process
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Members:</span>
              <Badge variant="outline" className="text-xs">
                Support
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStats;
