import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Dumbbell,
  CreditCard,
  UserCheck,
  Settings,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  Calendar,
  Mail,
  Bell,
  Shield,
  Database,
  Zap,
  Home,
  ArrowRight,
} from "lucide-react";

// Import consolidated dashboard components
import QuickStats from "../components/dashboard/QuickStats";
import QuickActions from "../components/dashboard/QuickActions";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import SystemHealth from "../components/dashboard/SystemHealth";
import NavigationHub from "../components/dashboard/NavigationHub";

// Import consolidated providers
import { useMemberStats } from "../components/providers/MemberStatsProvider";
import { useSystemHealth } from "../components/providers/SystemHealthProvider";
import { useQuickActions } from "../components/providers/QuickActionsProvider";

interface DashboardStats {
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
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // Use consolidated providers
  const { stats: memberStats, isLoading: memberStatsLoading } =
    useMemberStats();
  const { systemHealth, isLoading: systemHealthLoading } = useSystemHealth();
  const { quickActions, getActionsByCategory, getFavoriteActions } =
    useQuickActions();

  // Calculate dashboard stats from consolidated data
  const stats: DashboardStats = {
    totalUsers: 25, // This should come from user API
    totalMembers: memberStats?.totalMembers || 0,
    totalEquipment: 45, // This should come from equipment API
    totalPayments: 89, // This should come from payment API
    pendingPayments: 12, // This should come from payment API
    systemHealth: systemHealth?.overallStatus || "excellent",
    todayRevenue:
      memberStats?.revenueByMonth?.[memberStats.revenueByMonth.length - 1] || 0,
    activeMemberships: memberStats?.activeMembers || 0,
    maintenanceAlerts:
      systemHealth?.alerts?.filter((a) => !a.resolved && a.type === "warning")
        .length || 0,
    expiringMemberships: memberStats?.membershipsExpiring || 0,
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleActionClick = (action: any) => {
    action.action();
  };

  const handleFavoriteToggle = (actionId: string) => {
    // This will be handled by the QuickActionsProvider
    console.log("Toggle favorite for:", actionId);
  };

  const handleActivityClick = (activity: any) => {
    console.log("Activity clicked:", activity);

    if (activity.actionUrl) {
      navigate(activity.actionUrl);
    }
  };

  const handleMarkAsRead = (activityId: string) => {
    console.log("Mark as read:", activityId);
  };

  const handleRefresh = async () => {
    console.log("Refreshing dashboard...");
  };

  if (memberStatsLoading || systemHealthLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your gym system from one central location
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Admin Access</span>
          </Badge>
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleNavigate("/admin/settings")}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <QuickStats stats={stats} />

      {/* Main Dashboard Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions Panel */}
          <QuickActions
            actions={getFavoriteActions()}
            onActionClick={handleActionClick}
            onFavoriteToggle={handleFavoriteToggle}
          />

          {/* Recent Activity Feed */}
          <ActivityFeed
            onActivityClick={handleActivityClick}
            onMarkAsRead={handleMarkAsRead}
            onRefresh={handleRefresh}
          />
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage admin and staff accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getActionsByCategory("users").map((action) => (
                  <div
                    key={action.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer group"
                    onClick={() => handleActionClick(action)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/40 transition-colors">
                        {action.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {action.description}
                        </p>
                        {action.count && (
                          <Badge variant="secondary" className="mt-2">
                            {action.count}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Equipment Tab */}
        <TabsContent value="equipment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Equipment Management</CardTitle>
              <CardDescription>
                Monitor and manage gym equipment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getActionsByCategory("equipment").map((action) => (
                  <div
                    key={action.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer group"
                    onClick={() => handleActionClick(action)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/40 transition-colors">
                        {action.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {action.description}
                        </p>
                        {action.count && (
                          <Badge variant="secondary" className="mt-2">
                            {action.count}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Management</CardTitle>
              <CardDescription>Handle all payment operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getActionsByCategory("payments").map((action) => (
                  <div
                    key={action.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer group"
                    onClick={() => handleActionClick(action)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/40 transition-colors">
                        {action.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {action.description}
                        </p>
                        {action.count && (
                          <Badge variant="secondary" className="mt-2">
                            {action.count}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Member Management</CardTitle>
              <CardDescription>
                Manage gym members and memberships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getActionsByCategory("members").map((action) => (
                  <div
                    key={action.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer group"
                    onClick={() => handleActionClick(action)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-900/40 transition-colors">
                        {action.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {action.description}
                        </p>
                        {action.count && (
                          <Badge variant="secondary" className="mt-2">
                            {action.count}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <SystemHealth onRefresh={handleRefresh} />
        </TabsContent>
      </Tabs>

      {/* Navigation Hub */}
      <NavigationHub
        onNavigate={handleNavigate}
        showFavorites={true}
        showRecent={true}
        showQuickAccess={true}
      />
    </div>
  );
};

export default AdminDashboard;
