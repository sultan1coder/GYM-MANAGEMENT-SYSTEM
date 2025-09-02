import React, { useState, useEffect } from "react";
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
  Download,
  RefreshCw,
} from "lucide-react";

// Dashboard Components
import QuickStats from "../components/dashboard/QuickStats";
import SystemHealth from "../components/dashboard/SystemHealth";
import QuickActions from "../components/dashboard/QuickActions";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import NavigationHub from "../components/dashboard/NavigationHub";
import AdministrativeFeatures from "../components/AdministrativeFeatures";
import AdvancedAnalyticsDashboard from "../components/AdvancedAnalyticsDashboard";
import SystemManagementTools from "../components/SystemManagementTools";
import CommunicationNotifications from "../components/CommunicationNotifications";
import AdminProfileManagement from "../components/AdminProfileManagement";

// New Enhanced Components
import QuickAddModal from "../components/modals/QuickAddModal";
import { ExportManager } from "../utils/exportUtils";
import { useWebSocket } from "../components/providers/WebSocketProvider";
import config from "../config/environment";

// Providers
import { useMemberStats } from "../components/providers/MemberStatsProvider";
import { useSystemHealth } from "../components/providers/SystemHealthProvider";
import { useQuickActions } from "../components/providers/QuickActionsProvider";

const AdminDashboard: React.FC = () => {
  const { stats: memberStats, refetch: refetchMemberStats } = useMemberStats();
  const { systemHealth, refetch: refetchSystemHealth } = useSystemHealth();
  const { quickActions } = useQuickActions();

  // Only use WebSocket if enabled
  const webSocketHook = config.FEATURES.WEBSOCKET_ENABLED
    ? useWebSocket()
    : { isConnected: false };
  const { isConnected } = webSocketHook;

  // New state for enhanced features
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Calculate dashboard stats from providers
  const dashboardStats = {
    totalMembers: memberStats?.totalMembers || 0,
    activeMembers: memberStats?.activeMembers || 0,
    newMembers: memberStats?.newMembersThisMonth || 0,
    expiringMembers: memberStats?.membershipsExpiring || 0,
    systemStatus: systemHealth?.overallStatus || "unknown",
    uptime: systemHealth?.uptime || "0h 0m",
  };

  // Enhanced functions
  const handleQuickAdd = () => {
    setShowQuickAddModal(true);
  };

  const handleRefreshDashboard = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchMemberStats?.(), refetchSystemHealth?.()]);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error refreshing dashboard:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportDashboard = async () => {
    const dashboardData = {
      timestamp: new Date().toISOString(),
      stats: dashboardStats,
      memberStats,
      systemHealth,
    };

    await ExportManager.exportToJSON(
      [dashboardData],
      `dashboard_export_${new Date().toISOString().split("T")[0]}.json`
    );
  };

  // Real-time updates effect
  useEffect(() => {
    if (config.FEATURES.WEBSOCKET_ENABLED && isConnected) {
      // Auto-refresh every 5 minutes when WebSocket is connected
      const interval = setInterval(() => {
        handleRefreshDashboard();
      }, config.INTERVALS.DASHBOARD_REFRESH);

      return () => clearInterval(interval);
    } else if (config.FEATURES.REAL_TIME_UPDATES) {
      // Fallback: Auto-refresh every 2 minutes when WebSocket is disabled
      const interval = setInterval(() => {
        handleRefreshDashboard();
      }, 2 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [isConnected]);

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Enhanced Mobile-Responsive Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
              <p className="text-gray-600 text-sm md:text-base">
                Welcome back! Here's what's happening with your gym today.
              </p>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    config.FEATURES.WEBSOCKET_ENABLED
                      ? isConnected
                        ? "bg-green-500"
                        : "bg-red-500"
                      : "bg-blue-500"
                  }`}
                />
                <span className="text-xs text-gray-500">
                  {config.FEATURES.WEBSOCKET_ENABLED
                    ? isConnected
                      ? "Live"
                      : "Offline"
                    : "Auto-refresh"}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>

          {/* Mobile-Responsive Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportDashboard}
              className="flex-1 sm:flex-none"
            >
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshDashboard}
              disabled={isRefreshing}
              className="flex-1 sm:flex-none"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Clock className="h-4 w-4 mr-2" />
              {new Date().toLocaleDateString()}
            </Button>
            <Button onClick={handleQuickAdd} className="flex-1 sm:flex-none">
              <Plus className="h-4 w-4 mr-2" />
              <span className="sm:hidden">Add</span>
              <span className="hidden sm:inline">Quick Add</span>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <QuickStats stats={dashboardStats} memberStats={memberStats} />

        {/* Mobile-Responsive Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column - Quick Actions & System Health */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Quick Actions */}
            <QuickActions actions={quickActions} />

            {/* System Health */}
            <SystemHealth />
          </div>

          {/* Right Column - Activity Feed & Navigation */}
          <div className="space-y-4 md:space-y-6">
            {/* Activity Feed */}
            <ActivityFeed />

            {/* Navigation Hub */}
            <NavigationHub />
          </div>
        </div>

        {/* Administrative Features */}
        <AdministrativeFeatures />

        {/* Advanced Analytics Dashboard */}
        <AdvancedAnalyticsDashboard />

        {/* System Management Tools */}
        <SystemManagementTools />

        {/* Communication & Notifications */}
        <CommunicationNotifications />

        {/* Admin Profile Management */}
        <AdminProfileManagement />

        {/* Mobile-Responsive Bottom Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={showQuickAddModal}
        onClose={() => setShowQuickAddModal(false)}
        onSuccess={() => {
          // Refresh dashboard data after successful creation
          handleRefreshDashboard();
        }}
      />
    </div>
  );
};

export default AdminDashboard;
