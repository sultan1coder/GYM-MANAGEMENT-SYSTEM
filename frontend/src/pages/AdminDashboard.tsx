import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dumbbell,
  CreditCard,
  UserCheck,
  Clock,
  Plus,
  Database,
} from "lucide-react";

// Dashboard Components
import QuickStats from "../components/dashboard/QuickStats";
import SystemHealth from "../components/dashboard/SystemHealth";
import QuickActions from "../components/dashboard/QuickActions";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import NavigationHub from "../components/dashboard/NavigationHub";
import AdministrativeFeatures from "../components/AdministrativeFeatures";

// Providers
import { useMemberStats } from "../components/providers/MemberStatsProvider";
import { useSystemHealth } from "../components/providers/SystemHealthProvider";
import { useQuickActions } from "../components/providers/QuickActionsProvider";

const AdminDashboard: React.FC = () => {
  const { stats: memberStats } = useMemberStats();
  const { systemHealth } = useSystemHealth();
  const { quickActions } = useQuickActions();

  // Calculate dashboard stats from providers
  const dashboardStats = {
    totalMembers: memberStats?.totalMembers || 0,
    activeMembers: memberStats?.activeMembers || 0,
    newMembers: memberStats?.newMembersThisMonth || 0,
    expiringMembers: memberStats?.membershipsExpiring || 0,
    systemStatus: systemHealth?.overallStatus || "unknown",
    uptime: systemHealth?.uptime || "0h 0m",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome back! Here's what's happening with your gym today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Clock className="h-4 w-4 mr-2" />
              {new Date().toLocaleDateString()}
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Quick Add
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <QuickStats stats={dashboardStats} memberStats={memberStats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Quick Actions & System Health */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <QuickActions actions={quickActions} />

            {/* System Health */}
            <SystemHealth />
          </div>

          {/* Right Column - Activity Feed & Navigation */}
          <div className="space-y-6">
            {/* Activity Feed */}
            <ActivityFeed />

            {/* Navigation Hub */}
            <NavigationHub />
          </div>
        </div>

        {/* Administrative Features */}
        <AdministrativeFeatures />

        {/* Bottom Row - Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {memberStats?.revenueByMonth?.[
                  memberStats.revenueByMonth.length - 1
                ] || "0.00"}
              </div>
              <p className="text-xs text-muted-foreground">
                +{memberStats?.growthRate || "0"}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Subscriptions
              </CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {memberStats?.activeMembers || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {memberStats?.membershipTypes?.monthly || 0} monthly,{" "}
                {memberStats?.membershipTypes?.daily || 0} daily
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Equipment Status
              </CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">95%</div>
              <p className="text-xs text-muted-foreground">
                19 of 20 equipment operational
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                System Status
              </CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Badge
                  variant={
                    dashboardStats.systemStatus === "healthy"
                      ? "default"
                      : "destructive"
                  }
                >
                  {dashboardStats.systemStatus}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Uptime: {dashboardStats.uptime}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
