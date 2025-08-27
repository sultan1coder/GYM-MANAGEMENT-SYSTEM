import React, { useState, useEffect } from "react";
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

// Import dashboard components
import QuickStats from "../components/dashboard/QuickStats";
import QuickActions from "../components/dashboard/QuickActions";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import SystemHealth from "../components/dashboard/SystemHealth";
import NavigationHub from "../components/dashboard/NavigationHub";

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

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: "users" | "equipment" | "payments" | "members" | "system";
  action: () => void;
  status?: "active" | "warning" | "error";
  count?: number;
  priority?: "high" | "medium" | "low";
  isFavorite?: boolean;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalMembers: 0,
    totalEquipment: 0,
    totalPayments: 0,
    pendingPayments: 0,
    systemHealth: "excellent",
    todayRevenue: 0,
    activeMemberships: 0,
    maintenanceAlerts: 0,
    expiringMemberships: 0,
  });

  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Set mock data
      setStats({
        totalUsers: 25,
        totalMembers: 150,
        totalEquipment: 45,
        totalPayments: 89,
        pendingPayments: 12,
        systemHealth: "excellent",
        todayRevenue: 1250.0,
        activeMemberships: 142,
        maintenanceAlerts: 2,
        expiringMemberships: 8,
      });

      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  const quickActions: QuickAction[] = [
    // User Management
    {
      id: "add-user",
      title: "Add New User",
      description: "Create new admin or staff account",
      icon: <Users className="w-6 h-6" />,
      category: "users",
      action: () => handleNavigate("/admin/users/new"),
      status: "active",
      priority: "medium",
      isFavorite: true,
    },
    {
      id: "manage-users",
      title: "Manage Users",
      description: "View and edit user accounts",
      icon: <Eye className="w-6 h-6" />,
      category: "users",
      action: () => handleNavigate("/admin/users"),
      status: "active",
      priority: "high",
      isFavorite: true,
      count: 25,
    },
    {
      id: "user-approvals",
      title: "Pending Approvals",
      description: "Review user registration requests",
      icon: <Clock className="w-6 h-6" />,
      category: "users",
      action: () => handleNavigate("/admin/users/approvals"),
      status: "warning",
      priority: "high",
      isFavorite: false,
      count: 3,
    },

    // Equipment Management
    {
      id: "add-equipment",
      title: "Add Equipment",
      description: "Register new gym equipment",
      icon: <Plus className="w-6 h-6" />,
      category: "equipment",
      action: () => handleNavigate("/admin/equipment/new"),
      status: "active",
      priority: "medium",
      isFavorite: true,
    },
    {
      id: "equipment-status",
      title: "Equipment Status",
      description: "Monitor equipment health",
      icon: <Dumbbell className="w-6 h-6" />,
      category: "equipment",
      action: () => handleNavigate("/admin/equipment"),
      status: "active",
      priority: "high",
      isFavorite: true,
      count: 45,
    },
    {
      id: "maintenance-alerts",
      title: "Maintenance Alerts",
      description: "Equipment requiring attention",
      icon: <AlertTriangle className="w-6 h-6" />,
      category: "equipment",
      action: () => handleNavigate("/admin/equipment/maintenance"),
      status: "warning",
      priority: "high",
      isFavorite: true,
      count: 2,
    },

    // Payment Management
    {
      id: "create-payment",
      title: "Create Payment",
      description: "Record new payment transaction",
      icon: <Plus className="w-6 h-6" />,
      category: "payments",
      action: () => handleNavigate("/admin/payments/new"),
      status: "active",
      priority: "high",
      isFavorite: true,
    },
    {
      id: "payment-overview",
      title: "Payment Overview",
      description: "View all payment records",
      icon: <CreditCard className="w-6 h-6" />,
      category: "payments",
      action: () => handleNavigate("/admin/payments"),
      status: "active",
      priority: "high",
      isFavorite: true,
      count: 89,
    },
    {
      id: "pending-payments",
      title: "Pending Payments",
      description: "Review pending transactions",
      icon: <Clock className="w-6 h-6" />,
      category: "payments",
      action: () => handleNavigate("/admin/payments/pending"),
      status: "warning",
      priority: "medium",
      isFavorite: false,
      count: 12,
    },

    // Member Management
    {
      id: "add-member",
      title: "Add Member",
      description: "Register new gym member",
      icon: <Plus className="w-6 h-6" />,
      category: "members",
      action: () => handleNavigate("/admin/members/new"),
      status: "active",
      priority: "high",
      isFavorite: true,
    },
    {
      id: "member-overview",
      title: "Member Overview",
      description: "Manage all members",
      icon: <UserCheck className="w-6 h-6" />,
      category: "members",
      action: () => handleNavigate("/admin/members"),
      status: "active",
      priority: "high",
      isFavorite: true,
      count: 150,
    },
    {
      id: "expiring-memberships",
      title: "Expiring Memberships",
      description: "Memberships ending soon",
      icon: <Calendar className="w-6 h-6" />,
      category: "members",
      action: () => handleNavigate("/admin/members/expiring"),
      status: "warning",
      priority: "medium",
      isFavorite: false,
      count: 8,
    },

    // System Management
    {
      id: "system-settings",
      title: "System Settings",
      description: "Configure gym system",
      icon: <Settings className="w-6 h-6" />,
      category: "system",
      action: () => handleNavigate("/admin/settings"),
      status: "active",
      priority: "low",
      isFavorite: false,
    },
    {
      id: "system-health",
      title: "System Health",
      description: "Monitor system performance",
      icon: <Database className="w-6 h-6" />,
      category: "system",
      action: () => handleNavigate("/admin/health"),
      status: "active",
      priority: "medium",
      isFavorite: true,
    },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleActionClick = (action: QuickAction) => {
    action.action();
  };

  const handleFavoriteToggle = (actionId: string) => {
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

  if (isLoading) {
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
            actions={quickActions}
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
                {quickActions
                  .filter((action) => action.category === "users")
                  .map((action) => (
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
                {quickActions
                  .filter((action) => action.category === "equipment")
                  .map((action) => (
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
                {quickActions
                  .filter((action) => action.category === "payments")
                  .map((action) => (
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
                {quickActions
                  .filter((action) => action.category === "members")
                  .map((action) => (
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
