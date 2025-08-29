import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  UserCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
} from "lucide-react";

interface QuickStatsProps {
  stats: {
    totalMembers: number;
    activeMembers: number;
    newMembers: number;
    expiringMembers: number;
    systemStatus: string;
    uptime: string;
  };
  memberStats: any;
}

const QuickStats: React.FC<QuickStatsProps> = ({ stats, memberStats }) => {
  const getSystemHealthColor = (status: string) => {
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

  const getSystemHealthIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Members */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalMembers}</div>
          <p className="text-xs text-muted-foreground">
            +{memberStats?.growthRate?.toFixed(1) || "0"}% from last month
          </p>
          <Progress value={memberStats?.growthRate || 0} className="mt-2" />
        </CardContent>
      </Card>

      {/* Active Members */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Members</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeMembers}</div>
          <p className="text-xs text-muted-foreground">
            {memberStats?.inactiveMembers || 0} inactive members
          </p>
          <Progress 
            value={stats.totalMembers > 0 ? (stats.activeMembers / stats.totalMembers) * 100 : 0} 
            className="mt-2" 
          />
        </CardContent>
      </Card>

      {/* New Members This Month */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New This Month</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.newMembers}</div>
          <p className="text-xs text-muted-foreground">
            {memberStats?.recentRegistrations?.length || 0} recent registrations
          </p>
          <Progress 
            value={stats.totalMembers > 0 ? (stats.newMembers / stats.totalMembers) * 100 : 0} 
            className="mt-2" 
          />
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Status</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <Badge className={getSystemHealthColor(stats.systemStatus)}>
              {stats.systemStatus}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Uptime: {stats.uptime}
          </p>
          <div className="mt-2">
            {getSystemHealthIcon(stats.systemStatus)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStats;
