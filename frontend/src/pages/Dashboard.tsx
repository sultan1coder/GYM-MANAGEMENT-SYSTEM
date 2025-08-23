import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Dumbbell,
  TrendingUp,
  Calendar,
  DollarSign,
  Activity,
  Clock,
  UserPlus,
  BarChart3,
  ArrowUp,
  User,
} from "lucide-react";

// Mock data - replace with actual API calls
const mockStats = {
  totalMembers: 1247,
  activeMembers: 892,
  newMembersThisMonth: 67,
  totalRevenue: 45670,
  monthlyRevenue: 12340,
  equipmentCount: 156,
  upcomingMaintenance: 8,
  staffCount: 24,
};

const mockChartData = {
  membershipGrowth: [
    { month: "Jan", members: 980 },
    { month: "Feb", members: 1045 },
    { month: "Mar", members: 1120 },
    { month: "Apr", members: 1180 },
    { month: "May", members: 1210 },
    { month: "Jun", members: 1247 },
  ],
  revenueData: [
    { month: "Jan", revenue: 8500 },
    { month: "Feb", revenue: 9200 },
    { month: "Mar", revenue: 10100 },
    { month: "Apr", revenue: 11200 },
    { month: "May", revenue: 11800 },
    { month: "Jun", revenue: 12340 },
  ],
};

const mockRecentMembers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    membershipType: "Premium",
    joinDate: "2024-01-15",
    status: "Active",
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike@example.com",
    membershipType: "Basic",
    joinDate: "2024-01-14",
    status: "Active",
  },
  {
    id: 3,
    name: "Emma Davis",
    email: "emma@example.com",
    membershipType: "Premium",
    joinDate: "2024-01-13",
    status: "Active",
  },
];

const mockUpcomingEvents = [
  {
    id: 1,
    title: "Yoga Class",
    time: "09:00 AM",
    date: "Today",
    instructor: "Lisa Parker",
    participants: 15,
  },
  {
    id: 2,
    title: "HIIT Training",
    time: "06:00 PM",
    date: "Today",
    instructor: "John Smith",
    participants: 12,
  },
  {
    id: 3,
    title: "Equipment Maintenance",
    time: "10:00 AM",
    date: "Tomorrow",
    instructor: "Tech Team",
    participants: 0,
  },
];

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("month");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Dashboard Overview
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Welcome back! Here's what's happening at BILKHAYR GYM today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Members */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  Total Members
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  {mockStats.totalMembers.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="h-4 w-4 text-green-500" />
                  <span className="text-green-500 text-sm font-medium">
                    +5.2%
                  </span>
                  <span className="text-slate-500 text-sm">vs last month</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  Monthly Revenue
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  ${mockStats.monthlyRevenue.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="h-4 w-4 text-green-500" />
                  <span className="text-green-500 text-sm font-medium">
                    +12.8%
                  </span>
                  <span className="text-slate-500 text-sm">vs last month</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-xl">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          {/* Active Members */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  Active Members
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  {mockStats.activeMembers.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="h-4 w-4 text-green-500" />
                  <span className="text-green-500 text-sm font-medium">
                    +3.4%
                  </span>
                  <span className="text-slate-500 text-sm">vs last month</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-600 to-red-600 p-3 rounded-xl">
                <Activity className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          {/* Equipment Count */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  Equipment
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  {mockStats.equipmentCount}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-yellow-500 text-sm font-medium">
                    {mockStats.upcomingMaintenance} maintenance
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl">
                <Dumbbell className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Membership Growth Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Membership Growth
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Monthly member registrations
                </p>
              </div>
              <BarChart3 className="h-6 w-6 text-slate-400" />
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {mockChartData.membershipGrowth.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-lg w-full mb-2 transition-all hover:opacity-80"
                    style={{
                      height: `${(data.members / 1300) * 100}%`,
                      minHeight: "20px",
                    }}
                  ></div>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {data.month}
                  </span>
                  <span className="text-xs font-medium text-slate-900 dark:text-white">
                    {data.members}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Revenue Trend
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Monthly revenue growth
                </p>
              </div>
              <TrendingUp className="h-6 w-6 text-slate-400" />
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {mockChartData.revenueData.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="bg-gradient-to-t from-green-600 to-emerald-600 rounded-t-lg w-full mb-2 transition-all hover:opacity-80"
                    style={{
                      height: `${(data.revenue / 13000) * 100}%`,
                      minHeight: "20px",
                    }}
                  ></div>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {data.month}
                  </span>
                  <span className="text-xs font-medium text-slate-900 dark:text-white">
                    ${data.revenue}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Members */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Recent Members
              </h3>
              <Link
                to="/members"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {mockRecentMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {member.name}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {member.membershipType}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">
                      {member.joinDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Today's Schedule
              </h3>
              <Calendar className="h-6 w-6 text-slate-400" />
            </div>
            <div className="space-y-4">
              {mockUpcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-orange-600 to-red-600 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {event.title}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {event.instructor}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {event.time}
                    </p>
                    <p className="text-xs text-slate-500">
                      {event.participants > 0
                        ? `${event.participants} participants`
                        : "Maintenance"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/members/register"
              className="flex flex-col items-center p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              <UserPlus className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Add Member</span>
            </Link>
            <Link
              to="/equipments"
              className="flex flex-col items-center p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all"
            >
              <Dumbbell className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Manage Equipment</span>
            </Link>
            <Link
              to="/payments"
              className="flex flex-col items-center p-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all"
            >
              <DollarSign className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">View Payments</span>
            </Link>
            <Link
              to="/reports"
              className="flex flex-col items-center p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              <BarChart3 className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Generate Reports</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
