import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserCheck,
  Dumbbell,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useMemberStats } from "../providers/MemberStatsProvider";

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
  // Use consolidated member stats provider for additional data
  const { stats: memberStats } = useMemberStats();

  const getSystemHealthColor = (health: string) => {
    switch (health) {
      case "excellent":
        return "text-green-600 bg-green-50";
      case "good":
        return "text-blue-600 bg-blue-50";
      case "warning":
        return "text-yellow-600 bg-yellow-50";
      case "critical":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getSystemHealthIcon = (health: string) => {
    switch (health) {
      case "excellent":
        return <CheckCircle className="h-5 w-5" />;
      case "good":
        return <CheckCircle className="h-5 w-5" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      case "critical":
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <CheckCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Users */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalUsers}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Members */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <UserCheck className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalMembers}
              </p>
              {memberStats && (
                <p className="text-xs text-gray-500">
                  {memberStats.activeMembers} active •{" "}
                  {memberStats.inactiveMembers} inactive
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Equipment */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Equipment
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalEquipment}
              </p>
              {stats.maintenanceAlerts > 0 && (
                <Badge variant="destructive" className="mt-1">
                  {stats.maintenanceAlerts} needs attention
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Payments */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Payments
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalPayments}
              </p>
              {stats.pendingPayments > 0 && (
                <Badge variant="secondary" className="mt-1">
                  {stats.pendingPayments} pending
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <div
              className={`p-2 rounded-lg ${getSystemHealthColor(
                stats.systemHealth
              )}`}
            >
              {getSystemHealthIcon(stats.systemHealth)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">System Health</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.systemHealth.charAt(0).toUpperCase() +
                  stats.systemHealth.slice(1)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Revenue */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">
                Today's Revenue
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.todayRevenue.toLocaleString()}
              </p>
              {memberStats &&
                memberStats.revenueByMonth &&
                memberStats.revenueByMonth.length > 0 && (
                  <p className="text-xs text-gray-500">
                    Monthly: $
                    {memberStats.revenueByMonth[
                      memberStats.revenueByMonth.length - 1
                    ]?.toLocaleString() || 0}
                  </p>
                )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Memberships */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Memberships
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.activeMemberships}
              </p>
              {memberStats && (
                <p className="text-xs text-gray-500">
                  {memberStats.growthRate}% growth this month
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expiring Memberships */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.expiringMemberships}
              </p>
              {stats.expiringMemberships > 0 && (
                <Badge variant="secondary" className="mt-1">
                  Requires attention
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStats;
