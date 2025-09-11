import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import QuickStats from "../components/dashboard/QuickStats";
import SystemHealth from "../components/dashboard/SystemHealth";
import QuickActions from "../components/dashboard/QuickActions";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import NavigationHub from "../components/dashboard/NavigationHub";
import { useMemberStats } from "../components/providers/MemberStatsProvider";
import { useSystemHealth } from "../components/providers/SystemHealthProvider";
import { useQuickActions } from "../components/providers/QuickActionsProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  TrendingUp,
  Users,
  CreditCard,
  Dumbbell,
  Activity,
  AlertCircle,
} from "lucide-react";

const AdminDashboard: React.FC = () => {
  const memberStats = useMemberStats();
  const { systemHealth, refetch: refetchSystemHealth } = useSystemHealth();
  const { quickActions } = useQuickActions();

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculate dashboard stats from providers
  const dashboardStats = {
    totalMembers: memberStats.stats?.totalMembers || 0,
    activeMembers: memberStats.stats?.activeMembers || 0,
    newMembers: memberStats.stats?.newMembersThisMonth || 0,
    expiringMembers: memberStats.stats?.membershipsExpiring || 0,
    systemStatus: systemHealth?.overallStatus || "unknown",
    uptime: systemHealth?.uptime || "0h 0m",
  };

  const handleRefreshDashboard = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([memberStats.refetch?.(), refetchSystemHealth?.()]);
    } catch (error) {
      console.error("Error refreshing dashboard:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefreshDashboard();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6">
      <Header
        title="Admin Dashboard"
        subtitle="Comprehensive overview of your gym management system"
      />

      {/* Quick Stats */}
      <QuickStats stats={dashboardStats} memberStats={memberStats.stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Quick Actions & System Health */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <QuickActions actions={quickActions || []} />

          {/* System Health */}
          <SystemHealth />

          {/* Financial Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Financial Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    $
                    {(
                      memberStats.stats?.revenueByMonth?.slice(-1)[0] || 0
                    ).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Monthly Revenue</p>
                  <p className="text-xs text-green-600 mt-1">
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    +12.5% from last month
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    $
                    {(
                      memberStats.stats?.revenueByMonth?.reduce(
                        (a, b) => a + b,
                        0
                      ) || 0
                    ).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Annual Revenue</p>
                  <p className="text-xs text-blue-600 mt-1">
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    +8.2% from last year
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round(
                      (memberStats.stats?.revenueByMonth?.slice(-1)[0] || 0) /
                        (memberStats.stats?.totalMembers || 1)
                    )}
                  </p>
                  <p className="text-sm text-gray-600">
                    Avg Revenue per Member
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    +5.1% from last month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Equipment Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5" />
                Equipment Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">18</p>
                  <p className="text-sm text-gray-600">Operational</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: "90%" }}
                    ></div>
                  </div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">2</p>
                  <p className="text-sm text-gray-600">Maintenance</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{ width: "10%" }}
                    ></div>
                  </div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">1</p>
                  <p className="text-sm text-gray-600">Out of Service</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: "5%" }}
                    ></div>
                  </div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">21</p>
                  <p className="text-sm text-gray-600">Total Equipment</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Activity Feed & Navigation */}
        <div className="space-y-6">
          {/* Activity Feed */}
          <ActivityFeed />

          {/* Navigation Hub */}
          <NavigationHub />

          {/* Quick Refresh */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Dashboard Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  onClick={handleRefreshDashboard}
                  disabled={isRefreshing}
                  className="w-full"
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${
                      isRefreshing ? "animate-spin" : ""
                    }`}
                  />
                  {isRefreshing ? "Refreshing..." : "Refresh All Data"}
                </Button>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>Last updated: {new Date().toLocaleTimeString()}</span>
                </div>

                <div className="text-xs text-gray-500">
                  Auto-refresh every 5 minutes
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Membership Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Membership Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Monthly Memberships</span>
                <span className="font-bold">
                  {memberStats.stats?.membershipTypes?.monthly || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Daily Memberships</span>
                <span className="font-bold">
                  {memberStats.stats?.membershipTypes?.daily || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Expiring This Month</span>
                <span className="font-bold text-red-600">
                  {memberStats.stats?.membershipsExpiring || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Cities */}
        <Card>
          <CardHeader>
            <CardTitle>Top Member Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {memberStats.stats?.topCities?.slice(0, 5).map((city, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">
                    {city.city}, {city.state}
                  </span>
                  <span className="font-bold">{city.count} members</span>
                </div>
              )) || (
                <p className="text-sm text-gray-500">
                  No location data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
