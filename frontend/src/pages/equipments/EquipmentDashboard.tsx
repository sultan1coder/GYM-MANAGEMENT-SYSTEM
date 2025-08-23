import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Dumbbell,
  CheckCircle,
  Wrench,
  XCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  DollarSign,
  Package,
  Activity,
  Users,
  MapPin,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  Plus,
  Eye,
  Settings,
  AlertTriangle,
  Info,
  ArrowUp,
  ArrowDown,
  Filter,
  Download,
  Share2,
  MoreVertical,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userAPI } from "@/services/api";
import { Equipment, EquipmentStats } from "@/types";
import { toast } from "react-hot-toast";

// Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

interface EquipmentDashboardData {
  stats: EquipmentStats;
  equipment: Equipment[];
  maintenanceDue: Equipment[];
  mostUsed: Equipment[];
  leastUsed: Equipment[];
  categoryDistribution: { category: string; count: number; value: number }[];
  valueTrends: { month: string; value: number }[];
  usageTrends: { month: string; utilization: number }[];
  recentMaintenance: any[];
}

const EquipmentDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] =
    useState<EquipmentDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("month");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch equipment statistics
      const statsResponse = await userAPI.getEquipmentStats();
      const stats = (statsResponse.data as any).stats;
      const maintenanceDue = (statsResponse.data as any).maintenanceDue || [];
      const recentMaintenance = (statsResponse.data as any).recentMaintenance || [];

      // Fetch all equipment
      const equipmentResponse = await userAPI.getEquipment();
      const equipment = equipmentResponse.data.data || [];

      // Calculate additional metrics
      const mostUsed = [...equipment]
        .sort((a, b) => b.inUse / b.quantity - a.inUse / a.quantity)
        .slice(0, 5);

      const leastUsed = [...equipment]
        .filter((e) => e.quantity > 0)
        .sort((a, b) => a.inUse / a.quantity - b.inUse / b.quantity)
        .slice(0, 5);

      // Calculate category distribution
      const categoryMap = new Map<string, { count: number; value: number }>();
      equipment.forEach((e) => {
        const existing = categoryMap.get(e.category) || { count: 0, value: 0 };
        categoryMap.set(e.category, {
          count: existing.count + e.quantity,
          value: existing.value + (e.cost || 0) * e.quantity,
        });
      });

      const categoryDistribution = Array.from(categoryMap.entries()).map(
        ([category, data]) => ({
          category,
          count: data.count,
          value: data.value,
        })
      );

      // Mock value trends (replace with real API data)
      const valueTrends = [
        { month: "Jan", value: stats.totalValue * 0.8 },
        { month: "Feb", value: stats.totalValue * 0.85 },
        { month: "Mar", value: stats.totalValue * 0.9 },
        { month: "Apr", value: stats.totalValue * 0.95 },
        { month: "May", value: stats.totalValue * 0.98 },
        { month: "Jun", value: stats.totalValue },
      ];

      // Mock usage trends (replace with real API data)
      const usageTrends = [
        { month: "Jan", utilization: 65 },
        { month: "Feb", utilization: 68 },
        { month: "Mar", utilization: 72 },
        { month: "Apr", utilization: 75 },
        { month: "May", utilization: 78 },
        { month: "Jun", utilization: 82 },
      ];

      setDashboardData({
        stats,
        equipment,
        maintenanceDue,
        mostUsed,
        leastUsed,
        categoryDistribution,
        valueTrends,
        usageTrends,
        recentMaintenance,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Chart data
  const categoryChartData = {
    labels: dashboardData?.categoryDistribution.map((c) => c.category) || [],
    datasets: [
      {
        data: dashboardData?.categoryDistribution.map((c) => c.count) || [],
        backgroundColor: [
          "#3B82F6",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
          "#06B6D4",
          "#84CC16",
          "#F97316",
          "#EC4899",
          "#6366F1",
        ],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const valueTrendsData = {
    labels: dashboardData?.valueTrends.map((v) => v.month) || [],
    datasets: [
      {
        label: "Equipment Value",
        data: dashboardData?.valueTrends.map((v) => v.value) || [],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const usageTrendsData = {
    labels: dashboardData?.usageTrends.map((u) => u.month) || [],
    datasets: [
      {
        label: "Utilization Rate (%)",
        data: dashboardData?.usageTrends.map((u) => u.utilization) || [],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const statusChartData = {
    labels: ["Operational", "Maintenance", "Out of Service", "Retired"],
    datasets: [
      {
        data: [
          dashboardData?.stats.operational || 0,
          dashboardData?.stats.maintenance || 0,
          dashboardData?.stats.outOfService || 0,
          (dashboardData?.stats.total || 0) -
            (dashboardData?.stats.operational || 0) -
            (dashboardData?.stats.maintenance || 0) -
            (dashboardData?.stats.outOfService || 0),
        ],
        backgroundColor: [
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(107, 114, 128, 0.8)",
        ],
        borderColor: [
          "rgb(16, 185, 129)",
          "rgb(245, 158, 11)",
          "rgb(239, 68, 68)",
          "rgb(107, 114, 128)",
        ],
        borderWidth: 2,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
    },
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 mx-auto mb-4 text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading Equipment Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Error Loading Dashboard
          </h2>
          <p className="mb-4 text-gray-600">{error}</p>
          <Button onClick={fetchDashboardData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="mx-auto space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Equipment Dashboard
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Comprehensive overview of gym equipment statistics and analytics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchDashboardData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Link to="/equipments/manage">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Manage Equipment
              </Button>
            </Link>
          </div>
        </div>

        {/* Equipment Overview Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="text-white border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-100">
                    Total Equipment
                  </p>
                  <p className="text-2xl font-bold">
                    {dashboardData.stats.total}
                  </p>
                  <p className="text-xs text-blue-200">All categories</p>
                </div>
                <Dumbbell className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="text-white border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-100">
                    Operational
                  </p>
                  <p className="text-2xl font-bold">
                    {dashboardData.stats.operational}
                  </p>
                  <p className="text-xs text-green-200">
                    {dashboardData.stats.total > 0
                      ? Math.round(
                          (dashboardData.stats.operational /
                            dashboardData.stats.total) *
                            100
                        )
                      : 0}
                    % of total
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="text-white border-0 shadow-lg bg-gradient-to-r from-yellow-500 to-yellow-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-100">
                    In Maintenance
                  </p>
                  <p className="text-2xl font-bold">
                    {dashboardData.stats.maintenance}
                  </p>
                  <p className="text-xs text-yellow-200">
                    {dashboardData.maintenanceDue.length} due soon
                  </p>
                </div>
                <Wrench className="w-8 h-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="text-white border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-100">
                    Total Value
                  </p>
                  <p className="text-2xl font-bold">
                    ${dashboardData.stats.totalValue.toLocaleString()}
                  </p>
                  <p className="text-xs text-purple-200">Equipment assets</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Category Distribution */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Equipment by Category
              </CardTitle>
              <CardDescription>
                Distribution of equipment across different categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Doughnut data={categoryChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          {/* Equipment Status */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Equipment Status Overview
              </CardTitle>
              <CardDescription>
                Current operational status of all equipment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Doughnut data={statusChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Value Analytics */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Value Trends */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5" />
                Equipment Value Trends
              </CardTitle>
              <CardDescription>
                Equipment value changes over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Line data={valueTrendsData} options={lineChartOptions} />
              </div>
            </CardContent>
          </Card>

          {/* Usage Trends */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Equipment Utilization Trends
              </CardTitle>
              <CardDescription>Equipment usage rates over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Line data={usageTrendsData} options={lineChartOptions} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Maintenance Schedule */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Maintenance Schedule
            </CardTitle>
            <CardDescription>
              Upcoming maintenance due dates and alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.maintenanceDue.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.maintenanceDue.slice(0, 5).map((equipment) => (
                  <div
                    key={equipment.id}
                    className="flex items-center justify-between p-3 border border-yellow-200 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800"
                  >
                    <div className="flex items-center gap-3">
                      <Wrench className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {equipment.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Due:{" "}
                          {equipment.nextMaintenance
                            ? new Date(
                                equipment.nextMaintenance
                              ).toLocaleDateString()
                            : "Unknown"}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-yellow-800 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200"
                    >
                      Maintenance Due
                    </Badge>
                  </div>
                ))}
                {dashboardData.maintenanceDue.length > 5 && (
                  <div className="pt-2 text-center">
                    <Button variant="outline" size="sm">
                      View All ({dashboardData.maintenanceDue.length})
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
                <p>No maintenance due in the next 30 days</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Usage Analytics */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Most Used Equipment */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Most Used Equipment
              </CardTitle>
              <CardDescription>
                Equipment with highest utilization rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.mostUsed.map((equipment, index) => (
                  <div
                    key={equipment.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-green-600 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-400">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {equipment.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {equipment.category} • {equipment.type}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600 dark:text-green-400">
                        {equipment.quantity > 0
                          ? Math.round(
                              (equipment.inUse / equipment.quantity) * 100
                            )
                          : 0}
                        %
                      </p>
                      <p className="text-xs text-gray-500">
                        {equipment.inUse}/{equipment.quantity} in use
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Least Used Equipment */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                Least Used Equipment
              </CardTitle>
              <CardDescription>
                Equipment with lowest utilization rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.leastUsed.map((equipment, index) => (
                  <div
                    key={equipment.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-orange-600 bg-orange-100 rounded-full dark:bg-orange-900 dark:text-orange-400">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {equipment.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {equipment.category} • {equipment.type}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-orange-600 dark:text-orange-400">
                        {equipment.quantity > 0
                          ? Math.round(
                              (equipment.inUse / equipment.quantity) * 100
                            )
                          : 0}
                        %
                      </p>
                      <p className="text-xs text-gray-500">
                        {equipment.inUse}/{equipment.quantity} in use
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Value Analysis */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Category Value Analysis
            </CardTitle>
            <CardDescription>
              Equipment value distribution across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 font-medium text-left text-gray-900 dark:text-white">
                      Category
                    </th>
                    <th className="px-4 py-3 font-medium text-left text-gray-900 dark:text-white">
                      Count
                    </th>
                    <th className="px-4 py-3 font-medium text-left text-gray-900 dark:text-white">
                      Total Value
                    </th>
                    <th className="px-4 py-3 font-medium text-left text-gray-900 dark:text-white">
                      Avg. Value
                    </th>
                    <th className="px-4 py-3 font-medium text-left text-gray-900 dark:text-white">
                      % of Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.categoryDistribution.map((category) => (
                    <tr
                      key={category.category}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-blue-500" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {category.category}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {category.count}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        ${category.value.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        $
                        {category.count > 0
                          ? (category.value / category.count).toLocaleString(
                              undefined,
                              { maximumFractionDigits: 0 }
                            )
                          : 0}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className="text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300"
                        >
                          {dashboardData.stats.totalValue > 0
                            ? Math.round(
                                (category.value /
                                  dashboardData.stats.totalValue) *
                                  100
                              )
                            : 0}
                          %
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Maintenance Logs */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Recent Maintenance Logs
            </CardTitle>
            <CardDescription>
              Latest maintenance activities and repairs performed
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.recentMaintenance && dashboardData.recentMaintenance.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentMaintenance.slice(0, 5).map((log: any) => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40">
                        <Wrench className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {log.equipment?.name || 'Unknown Equipment'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {log.type} • {log.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Performed by: {log.performedBy || 'Unknown'} • {new Date(log.performedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {log.type}
                      </Badge>
                      {log.cost && (
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                          ${parseFloat(log.cost).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {dashboardData.recentMaintenance.length > 5 && (
                  <div className="text-center pt-2">
                    <Button variant="outline" size="sm">
                      View All ({dashboardData.recentMaintenance.length})
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Wrench className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No recent maintenance logs found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common equipment management tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link to="/equipments/manage">
                <Button
                  variant="outline"
                  className="flex-col w-full h-20 gap-2"
                >
                  <Plus className="w-6 h-6" />
                  <span>Add Equipment</span>
                </Button>
              </Link>
              <Link to="/equipments/all">
                <Button
                  variant="outline"
                  className="flex-col w-full h-20 gap-2"
                >
                  <Eye className="w-6 h-6" />
                  <span>View All Equipment</span>
                </Button>
              </Link>
              <Button variant="outline" className="flex-col w-full h-20 gap-2">
                <Download className="w-6 h-6" />
                <span>Export Report</span>
              </Button>
              <Button variant="outline" className="flex-col w-full h-20 gap-2">
                <Share2 className="w-6 h-6" />
                <span>Share Dashboard</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EquipmentDashboard;
