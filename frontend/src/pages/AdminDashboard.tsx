import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import QuickStats from "../components/dashboard/QuickStats";
import SystemHealth from "../components/dashboard/SystemHealth";
import QuickActions from "../components/dashboard/QuickActions";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import NavigationHub from "../components/dashboard/NavigationHub";
import { useMemberStats } from "../components/providers/MemberStatsProvider";
import { useSystemHealth } from "../components/providers/SystemHealthProvider";
import { useQuickActions } from "../components/providers/QuickActionsProvider";
import { useSidebar } from "../contexts/SidebarContext";
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
  Home,
  UserPlus,
  DollarSign,
  Clock,
  BarChart3,
  Settings,
  Shield,
} from "lucide-react";

const AdminDashboard: React.FC = () => {
  const memberStats = useMemberStats();
  const { systemHealth, refetch: refetchSystemHealth } = useSystemHealth();
  const { quickActions } = useQuickActions();
  const { isOpen, toggleSidebar } = useSidebar();

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

  // Admin menu items with icons
  const adminMenuItems = [
    {
      title: "Dashboard",
      icon: <Home className="w-6 h-6" />,
      path: "/admin/dashboard",
      color: "bg-blue-500",
    },
    {
      title: "User Management",
      icon: <Users className="w-6 h-6" />,
      path: "/admin/users",
      color: "bg-green-500",
    },
    {
      title: "Member Management",
      icon: <UserPlus className="w-6 h-6" />,
      path: "/admin/members",
      color: "bg-purple-500",
    },
    {
      title: "Equipment",
      icon: <Dumbbell className="w-6 h-6" />,
      path: "/admin/equipments",
      color: "bg-orange-500",
    },
    {
      title: "Payments",
      icon: <CreditCard className="w-6 h-6" />,
      path: "/admin/payments",
      color: "bg-emerald-500",
    },
    {
      title: "Subscriptions",
      icon: <DollarSign className="w-6 h-6" />,
      path: "/admin/subscriptions",
      color: "bg-cyan-500",
    },
    {
      title: "Attendance",
      icon: <Clock className="w-6 h-6" />,
      path: "/admin/attendance",
      color: "bg-indigo-500",
    },
    {
      title: "Workouts",
      icon: <Activity className="w-6 h-6" />,
      path: "/admin/workouts",
      color: "bg-pink-500",
    },
    {
      title: "Reports",
      icon: <BarChart3 className="w-6 h-6" />,
      path: "/admin/reports",
      color: "bg-teal-500",
    },
    {
      title: "Settings",
      icon: <Settings className="w-6 h-6" />,
      path: "/admin/settings",
      color: "bg-gray-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Menu Toggle */}
      <Header
        title="Admin Dashboard"
        subtitle="Comprehensive overview of your gym management system"
        onMenuToggle={toggleSidebar}
        isMenuOpen={isOpen}
        showSearch={true}
        showBreadcrumbs={true}
      />

      <div
        className={`space-y-6 transition-all duration-300 ${
          isOpen ? "p-6" : "p-6"
        }`}
      >
        {/* Quick Stats */}
        <QuickStats stats={dashboardStats} memberStats={memberStats.stats} />

        {/* Admin Navigation Menu */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Admin Panel Navigation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {adminMenuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="group flex flex-col items-center p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 hover:scale-105"
                >
                  <div
                    className={`p-3 rounded-full ${item.color} text-white mb-3 group-hover:scale-110 transition-transform duration-200`}
                  >
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-center group-hover:text-gray-900">
                    {item.title}
                  </span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Quick Actions & System Health */}
          <div className="space-y-6 lg:col-span-2">
            {/* Quick Actions */}
            <QuickActions actions={quickActions || []} />

            {/* System Health */}
            <SystemHealth />

            {/* Financial Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Financial Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      $
                      {(
                        memberStats.stats?.revenueByMonth?.slice(-1)[0] || 0
                      ).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Monthly Revenue</p>
                    <p className="mt-1 text-xs text-green-600">
                      <TrendingUp className="inline w-3 h-3 mr-1" />
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
                    <p className="mt-1 text-xs text-blue-600">
                      <TrendingUp className="inline w-3 h-3 mr-1" />
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
                    <p className="mt-1 text-xs text-purple-600">
                      <TrendingUp className="inline w-3 h-3 mr-1" />
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
                  <Dumbbell className="w-5 h-5" />
                  Equipment Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="p-4 text-center rounded-lg bg-green-50">
                    <p className="text-2xl font-bold text-green-600">18</p>
                    <p className="text-sm text-gray-600">Operational</p>
                    <div className="w-full h-2 mt-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-green-600 rounded-full"
                        style={{ width: "90%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="p-4 text-center rounded-lg bg-yellow-50">
                    <p className="text-2xl font-bold text-yellow-600">2</p>
                    <p className="text-sm text-gray-600">Maintenance</p>
                    <div className="w-full h-2 mt-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-yellow-600 rounded-full"
                        style={{ width: "10%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="p-4 text-center rounded-lg bg-red-50">
                    <p className="text-2xl font-bold text-red-600">1</p>
                    <p className="text-sm text-gray-600">Out of Service</p>
                    <div className="w-full h-2 mt-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-red-600 rounded-full"
                        style={{ width: "5%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="p-4 text-center rounded-lg bg-blue-50">
                    <p className="text-2xl font-bold text-blue-600">21</p>
                    <p className="text-sm text-gray-600">Total Equipment</p>
                    <div className="w-full h-2 mt-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-blue-600 rounded-full"
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
                  <Activity className="w-5 h-5" />
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
                    <AlertCircle className="w-4 h-4" />
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Membership Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Membership Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Monthly Memberships</span>
                  <span className="font-bold">
                    {memberStats.stats?.membershipTypes?.monthly || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Daily Memberships</span>
                  <span className="font-bold">
                    {memberStats.stats?.membershipTypes?.daily || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
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
                {memberStats.stats?.topCities
                  ?.slice(0, 5)
                  .map((city, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
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
    </div>
  );
};

export default AdminDashboard;
