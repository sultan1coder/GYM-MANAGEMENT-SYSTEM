import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Dumbbell,
  DollarSign,
  BarChart3,
  ArrowUp,
  Shield,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  Bell,
  Database,
  Server,
  Zap,
  Globe,
  CreditCard,
  UserCheck,
  PieChart,
  Plus,
  Edit,
  Star,
  Award,
} from "lucide-react";

// Mock admin data - replace with actual API calls
const mockAdminStats = {
  totalUsers: 124,
  totalMembers: 1247,
  totalStaff: 24,
  activeMembers: 892,
  inactiveMembers: 355,
  monthlyRevenue: 45670,
  yearlyRevenue: 387540,
  equipmentCount: 156,
  maintenanceAlerts: 8,
  systemHealth: 98.5,
  serverUptime: 99.9,
  storageUsed: 68.3,
  bandwidthUsage: 45.2,
};

const mockRevenueBreakdown = [
  {
    category: "Memberships",
    amount: 35000,
    percentage: 76.6,
    color: "from-blue-600 to-blue-700",
  },
  {
    category: "Personal Training",
    amount: 8500,
    percentage: 18.6,
    color: "from-green-600 to-green-700",
  },
  {
    category: "Equipment Rental",
    amount: 1670,
    percentage: 3.7,
    color: "from-purple-600 to-purple-700",
  },
  {
    category: "Merchandise",
    amount: 500,
    percentage: 1.1,
    color: "from-orange-600 to-orange-700",
  },
];

const mockSystemAlerts = [
  {
    id: 1,
    type: "warning",
    title: "Equipment Maintenance Due",
    message: "3 treadmills require scheduled maintenance",
    time: "2 hours ago",
    priority: "medium",
  },
  {
    id: 2,
    type: "info",
    title: "New Member Registration",
    message: "5 new members registered today",
    time: "4 hours ago",
    priority: "low",
  },
  {
    id: 3,
    type: "error",
    title: "Payment Failed",
    message: "2 payment transactions failed processing",
    time: "6 hours ago",
    priority: "high",
  },
];

const mockRecentActivities = [
  {
    id: 1,
    user: "John Smith",
    action: "Created new member account",
    target: "Sarah Wilson",
    time: "5 minutes ago",
    type: "create",
  },
  {
    id: 2,
    user: "Lisa Parker",
    action: "Updated equipment status",
    target: "Treadmill #5",
    time: "15 minutes ago",
    type: "update",
  },
  {
    id: 3,
    user: "Mike Johnson",
    action: "Processed payment",
    target: "Member #1247",
    time: "32 minutes ago",
    type: "payment",
  },
  {
    id: 4,
    user: "Admin",
    action: "Generated monthly report",
    target: "Revenue Analytics",
    time: "1 hour ago",
    type: "report",
  },
];

const mockTopPerformers = [
  {
    id: 1,
    name: "Lisa Parker",
    role: "Personal Trainer",
    clients: 45,
    revenue: 12500,
    rating: 4.9,
  },
  {
    id: 2,
    name: "John Smith",
    role: "Fitness Coach",
    clients: 38,
    revenue: 9800,
    rating: 4.8,
  },
  {
    id: 3,
    name: "Emma Davis",
    role: "Yoga Instructor",
    clients: 32,
    revenue: 7600,
    rating: 4.9,
  },
];

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState("month");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="p-6 mx-auto space-y-8 max-w-7xl">
        {/* Admin Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Complete system overview and management controls
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-white border rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>

            <button className="flex items-center gap-2 px-4 py-2 text-white transition-all rounded-lg bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* System Health Overview */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* System Health */}
          <div className="p-6 transition-all bg-white shadow-lg dark:bg-slate-800 rounded-2xl hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  System Health
                </p>
                <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                  {mockAdminStats.systemHealth}%
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-500">
                    Excellent
                  </span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
                <Server className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Server Uptime */}
          <div className="p-6 transition-all bg-white shadow-lg dark:bg-slate-800 rounded-2xl hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Server Uptime
                </p>
                <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                  {mockAdminStats.serverUptime}%
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-slate-500">30 days</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl">
                <Globe className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Storage Usage */}
          <div className="p-6 transition-all bg-white shadow-lg dark:bg-slate-800 rounded-2xl hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Storage Used
                </p>
                <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                  {mockAdminStats.storageUsed}%
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-500">
                    +2.3GB
                  </span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                <Database className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Active Alerts */}
          <div className="p-6 transition-all bg-white shadow-lg dark:bg-slate-800 rounded-2xl hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Active Alerts
                </p>
                <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                  {mockSystemAlerts.length}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-500">
                    1 High Priority
                  </span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl">
                <Bell className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Business Metrics */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Revenue */}
          <div className="p-6 transition-all bg-white shadow-lg dark:bg-slate-800 rounded-2xl hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Monthly Revenue
                </p>
                <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                  ${mockAdminStats.monthlyRevenue.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-500">
                    +15.3%
                  </span>
                  <span className="text-sm text-slate-500">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Total Users */}
          <div className="p-6 transition-all bg-white shadow-lg dark:bg-slate-800 rounded-2xl hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Users
                </p>
                <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                  {(
                    mockAdminStats.totalMembers + mockAdminStats.totalStaff
                  ).toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-500">
                    +8.7%
                  </span>
                  <span className="text-sm text-slate-500">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Active Members */}
          <div className="p-6 transition-all bg-white shadow-lg dark:bg-slate-800 rounded-2xl hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Active Members
                </p>
                <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                  {mockAdminStats.activeMembers.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <UserCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium text-emerald-500">
                    71.5% active
                  </span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Equipment Status */}
          <div className="p-6 transition-all bg-white shadow-lg dark:bg-slate-800 rounded-2xl hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Equipment
                </p>
                <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                  {mockAdminStats.equipmentCount}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-yellow-500">
                    {mockAdminStats.maintenanceAlerts} need maintenance
                  </span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                <Dumbbell className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown & Analytics */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Revenue Breakdown */}
          <div className="p-6 bg-white shadow-lg lg:col-span-2 dark:bg-slate-800 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Revenue Breakdown
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Income sources this month
                </p>
              </div>
              <PieChart className="w-6 h-6 text-slate-400" />
            </div>

            <div className="space-y-4">
              {mockRevenueBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full bg-gradient-to-r ${item.color}`}
                    ></div>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {item.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      ${item.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-500">{item.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 dark:text-white">
                  Total Revenue
                </span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  $
                  {mockRevenueBreakdown
                    .reduce((sum, item) => sum + item.amount, 0)
                    .toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="p-6 bg-white shadow-lg dark:bg-slate-800 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Top Performers
              </h3>
              <Award className="w-6 h-6 text-slate-400" />
            </div>

            <div className="space-y-4">
              {mockTopPerformers.map((performer, index) => (
                <div
                  key={performer.id}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-r ${
                        index === 0
                          ? "from-yellow-500 to-orange-500"
                          : index === 1
                          ? "from-gray-400 to-gray-500"
                          : "from-orange-600 to-red-600"
                      } flex items-center justify-center text-white font-bold text-sm`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {performer.name}
                      </p>
                      <p className="text-xs text-slate-500">{performer.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      ${performer.revenue.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-slate-500">
                        {performer.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Alerts & Recent Activity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* System Alerts */}
          <div className="p-6 bg-white shadow-lg dark:bg-slate-800 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                System Alerts
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">
                  {mockSystemAlerts.length} active
                </span>
                <Bell className="w-5 h-5 text-slate-400" />
              </div>
            </div>

            <div className="space-y-4">
              {mockSystemAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl"
                >
                  <div
                    className={`p-2 rounded-lg ${
                      alert.type === "error"
                        ? "bg-red-100 dark:bg-red-900"
                        : alert.type === "warning"
                        ? "bg-yellow-100 dark:bg-yellow-900"
                        : "bg-blue-100 dark:bg-blue-900"
                    }`}
                  >
                    {alert.type === "error" ? (
                      <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    ) : alert.type === "warning" ? (
                      <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {alert.title}
                      </p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          alert.priority === "high"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : alert.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        }`}
                      >
                        {alert.priority}
                      </span>
                    </div>
                    <p className="mb-1 text-sm text-slate-600 dark:text-slate-400">
                      {alert.message}
                    </p>
                    <p className="text-xs text-slate-500">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-6 bg-white shadow-lg dark:bg-slate-800 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Recent Activity
              </h3>
              <Link
                to="/admin/activity"
                className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {mockRecentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl"
                >
                  <div
                    className={`p-2 rounded-lg ${
                      activity.type === "create"
                        ? "bg-green-100 dark:bg-green-900"
                        : activity.type === "update"
                        ? "bg-blue-100 dark:bg-blue-900"
                        : activity.type === "payment"
                        ? "bg-purple-100 dark:bg-purple-900"
                        : "bg-orange-100 dark:bg-orange-900"
                    }`}
                  >
                    {activity.type === "create" ? (
                      <Plus className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : activity.type === "update" ? (
                      <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    ) : activity.type === "payment" ? (
                      <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    ) : (
                      <BarChart3 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-slate-900 dark:text-white">
                      <span className="font-medium">{activity.user}</span>{" "}
                      {activity.action}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {activity.target}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="p-6 bg-white shadow-lg dark:bg-slate-800 rounded-2xl">
          <h3 className="mb-6 text-xl font-semibold text-slate-900 dark:text-white">
            Admin Controls
          </h3>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            <Link
              to="/admin/users"
              className="flex flex-col items-center p-4 text-white transition-all bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800"
            >
              <Users className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium text-center">
                User Management
              </span>
            </Link>

            <Link
              to="/admin/settings"
              className="flex flex-col items-center p-4 text-white transition-all bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl hover:from-gray-700 hover:to-gray-800"
            >
              <Settings className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium text-center">
                System Settings
              </span>
            </Link>

            <Link
              to="/admin/reports"
              className="flex flex-col items-center p-4 text-white transition-all bg-gradient-to-r from-green-600 to-green-700 rounded-xl hover:from-green-700 hover:to-green-800"
            >
              <BarChart3 className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium text-center">Analytics</span>
            </Link>

            <Link
              to="/admin/backup"
              className="flex flex-col items-center p-4 text-white transition-all bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl hover:from-purple-700 hover:to-purple-800"
            >
              <Database className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium text-center">Backup</span>
            </Link>

            <Link
              to="/admin/maintenance"
              className="flex flex-col items-center p-4 text-white transition-all bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl hover:from-yellow-700 hover:to-yellow-800"
            >
              <Dumbbell className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium text-center">
                Maintenance
              </span>
            </Link>

            <Link
              to="/admin/security"
              className="flex flex-col items-center p-4 text-white transition-all bg-gradient-to-r from-red-600 to-red-700 rounded-xl hover:from-red-700 hover:to-red-800"
            >
              <Shield className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium text-center">Security</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
