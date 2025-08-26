import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Users,
  Dumbbell,
  DollarSign,
  ArrowUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  Bell,
  Server,
  CreditCard,
  UserCheck,
  Star,
  Award,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { userAPI } from "../services/api";
import { Badge } from "@/components/ui/badge";
import AdministrativeFeatures from "@/components/AdministrativeFeatures";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Set global Chart.js defaults for better appearance
ChartJS.defaults.font.family = "'Inter', 'system-ui', 'sans-serif'";
ChartJS.defaults.color = "#64748b";
ChartJS.defaults.borderColor = "rgba(0, 0, 0, 0.05)";

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

// Chart data
const monthlyRevenueData = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "Revenue",
      data: [
        32000, 35000, 38000, 42000, 45000, 48000, 52000, 49000, 46000, 50000,
        53000, 45670,
      ],
      borderColor: "rgb(99, 102, 241)",
      backgroundColor: function (context: any) {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) {
          return "rgba(99, 102, 241, 0.1)";
        }
        const gradient = ctx.createLinearGradient(
          0,
          chartArea.bottom,
          0,
          chartArea.top
        );
        gradient.addColorStop(0, "rgba(99, 102, 241, 0.1)");
        gradient.addColorStop(1, "rgba(99, 102, 241, 0.3)");
        return gradient;
      },
      fill: true,
      tension: 0.4,
      pointBackgroundColor: "rgb(99, 102, 241)",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointHoverBackgroundColor: "rgb(99, 102, 241)",
      pointHoverBorderColor: "#fff",
    },
    {
      label: "Target",
      data: [
        30000, 32000, 35000, 38000, 40000, 42000, 45000, 47000, 49000, 50000,
        52000, 54000,
      ],
      borderColor: "rgb(34, 197, 94)",
      backgroundColor: "rgba(34, 197, 94, 0.1)",
      fill: false,
      tension: 0.4,
      borderDash: [5, 5],
      pointBackgroundColor: "rgb(34, 197, 94)",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: "rgb(34, 197, 94)",
      pointHoverBorderColor: "#fff",
    },
  ],
};

const memberGrowthData = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "New Members",
      data: [45, 52, 48, 61, 55, 67, 73, 68, 75, 82, 78, 85],
      backgroundColor: "rgba(59, 130, 246, 0.8)",
      borderRadius: 8,
      borderSkipped: false,
      borderColor: "rgba(59, 130, 246, 1)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(59, 130, 246, 1)",
      hoverBorderColor: "rgba(59, 130, 246, 1)",
    },
    {
      label: "Active Members",
      data: [120, 135, 142, 158, 165, 178, 185, 192, 198, 205, 212, 892],
      backgroundColor: "rgba(16, 185, 129, 0.8)",
      borderRadius: 8,
      borderSkipped: false,
      borderColor: "rgba(16, 185, 129, 1)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(16, 185, 129, 1)",
      hoverBorderColor: "rgba(16, 185, 129, 1)",
    },
  ],
};

const equipmentStatusData = {
  labels: ["Operational", "Maintenance", "Out of Service"],
  datasets: [
    {
      data: [153, 3, 0],
      backgroundColor: [
        "rgba(34, 197, 94, 0.8)",
        "rgba(245, 158, 11, 0.8)",
        "rgba(239, 68, 68, 0.8)",
      ],
      borderColor: [
        "rgb(34, 197, 94)",
        "rgb(245, 158, 11)",
        "rgb(239, 68, 68)",
      ],
      borderWidth: 3,
      hoverOffset: 8,
      hoverBackgroundColor: [
        "rgba(34, 197, 94, 1)",
        "rgba(245, 158, 11, 1)",
        "rgba(239, 68, 68, 1)",
      ],
    },
  ],
};

const systemPerformanceData = {
  labels: ["CPU", "Memory", "Storage", "Network", "Database"],
  datasets: [
    {
      label: "Current Usage",
      data: [65, 78, 68, 45, 82],
      backgroundColor: "rgba(99, 102, 241, 0.8)",
      borderRadius: 6,
      borderSkipped: false,
      borderColor: "rgba(99, 102, 241, 1)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(99, 102, 241, 1)",
      hoverBorderColor: "rgba(99, 102, 241, 1)",
    },
    {
      label: "Peak Usage",
      data: [85, 92, 88, 78, 95],
      backgroundColor: "rgba(239, 68, 68, 0.8)",
      borderRadius: 6,
      borderSkipped: false,
      borderColor: "rgba(239, 68, 68, 1)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(239, 68, 68, 1)",
      hoverBorderColor: "rgba(239, 68, 68, 1)",
    },
  ],
};

const weeklyActivityData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Member Check-ins",
      data: [145, 167, 189, 203, 178, 156, 134],
      borderColor: "rgb(168, 85, 247)",
      backgroundColor: function (context: any) {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) {
          return "rgba(168, 85, 247, 0.1)";
        }
        const gradient = ctx.createLinearGradient(
          0,
          chartArea.bottom,
          0,
          chartArea.top
        );
        gradient.addColorStop(0, "rgba(168, 85, 247, 0.1)");
        gradient.addColorStop(1, "rgba(168, 85, 247, 0.3)");
        return gradient;
      },
      fill: true,
      tension: 0.4,
      pointBackgroundColor: "rgb(168, 85, 247)",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointHoverBackgroundColor: "rgb(168, 85, 247)",
      pointHoverBorderColor: "#fff",
    },
    {
      label: "Equipment Usage",
      data: [89, 102, 115, 128, 112, 98, 87],
      borderColor: "rgb(236, 72, 153)",
      backgroundColor: function (context: any) {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) {
          return "rgba(236, 72, 153, 0.1)";
        }
        const gradient = ctx.createLinearGradient(
          0,
          chartArea.bottom,
          0,
          chartArea.top
        );
        gradient.addColorStop(0, "rgba(236, 72, 153, 0.1)");
        gradient.addColorStop(1, "rgba(236, 72, 153, 0.3)");
        return gradient;
      },
      fill: true,
      tension: 0.4,
      pointBackgroundColor: "rgb(236, 72, 153)",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointHoverBackgroundColor: "rgb(236, 72, 153)",
      pointHoverBorderColor: "#fff",
    },
  ],
};

const revenueBreakdownData = {
  labels: [
    "Memberships",
    "Personal Training",
    "Equipment Rental",
    "Merchandise",
  ],
  datasets: [
    {
      data: [35000, 8500, 1670, 500],
      backgroundColor: [
        "rgba(59, 130, 246, 0.8)",
        "rgba(16, 185, 129, 0.8)",
        "rgba(168, 85, 247, 0.8)",
        "rgba(245, 158, 11, 0.8)",
      ],
      borderColor: [
        "rgb(59, 130, 246)",
        "rgb(16, 185, 129)",
        "rgb(168, 85, 247)",
        "rgb(245, 158, 11)",
      ],
      borderWidth: 3,
      hoverOffset: 8,
      hoverBackgroundColor: [
        "rgba(59, 130, 246, 1)",
        "rgba(16, 185, 129, 1)",
        "rgba(168, 85, 247, 1)",
        "rgba(245, 158, 11, 1)",
      ],
    },
  ],
};

// Chart options
const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1000,
  },
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
          weight: "bold" as const,
        },
        color: "#64748b",
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.9)",
      titleColor: "#fff",
      bodyColor: "#fff",
      borderColor: "rgba(255, 255, 255, 0.1)",
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      mode: "index" as const,
      intersect: false,
      titleFont: {
        size: 14,
        weight: "bold" as const,
      },
      bodyFont: {
        size: 13,
      },
      callbacks: {
        label: function (context: any) {
          let label = context.dataset.label || "";
          if (label) {
            label += ": ";
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(context.parsed.y);
          }
          return label;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 11,
        },
        color: "#64748b",
      },
    },
    y: {
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
      },
      ticks: {
        font: {
          size: 11,
        },
        color: "#64748b",
        callback: function (value: any) {
          if (typeof value === "number") {
            return "$" + value.toLocaleString();
          }
          return value;
        },
      },
    },
  },
  interaction: {
    mode: "nearest" as const,
    axis: "x" as const,
    intersect: false,
  },
  elements: {
    point: {
      hoverRadius: 8,
      radius: 6,
    },
    line: {
      tension: 0.4,
    },
  },
  onHover: (event: any, activeElements: any) => {
    const canvas = event.native.target;
    if (activeElements.length > 0) {
      canvas.style.cursor = "pointer";
    } else {
      canvas.style.cursor = "default";
    }
  },
  // Performance optimizations
  spanGaps: true,
};

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1000,
  },
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
          weight: "bold" as const,
        },
        color: "#64748b",
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.9)",
      titleColor: "#fff",
      bodyColor: "#fff",
      borderColor: "rgba(255, 255, 255, 0.1)",
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      titleFont: {
        size: 14,
        weight: "bold" as const,
      },
      bodyFont: {
        size: 13,
      },
      callbacks: {
        label: function (context: any) {
          let label = context.dataset.label || "";
          if (label) {
            label += ": ";
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y.toLocaleString();
          }
          return label;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 11,
        },
        color: "#64748b",
      },
    },
    y: {
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
      },
      ticks: {
        font: {
          size: 11,
        },
        color: "#64748b",
      },
    },
  },
  elements: {
    bar: {
      borderRadius: 8,
    },
  },
};

const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1000,
  },
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
          weight: "bold" as const,
        },
        color: "#64748b",
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.9)",
      titleColor: "#fff",
      bodyColor: "#fff",
      borderColor: "rgba(255, 255, 255, 0.1)",
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      titleFont: {
        size: 14,
        weight: "bold" as const,
      },
      bodyFont: {
        size: 13,
      },
      callbacks: {
        label: function (context: any) {
          let label = context.label || "";
          if (label) {
            label += ": ";
          }
          if (context.parsed !== null) {
            if (context.datasetIndex === 0) {
              // Revenue breakdown
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(context.parsed);
            } else {
              // Equipment status
              label += context.parsed + " units";
            }
          }
          return label;
        },
      },
    },
  },
  elements: {
    arc: {
      borderWidth: 2,
      hoverOffset: 8,
    },
  },
};

// Mock revenue breakdown data - commented out for now
// const mockRevenueBreakdown = [
//   {
//     category: "Memberships",
//     amount: 35000,
//     percentage: 76.6,
//     color: "from-blue-500 to-blue-600",
//     icon: Users,
//   },
//   {
//     category: "Personal Training",
//     amount: 8500,
//     percentage: 18.6,
//     color: "from-emerald-500 to-emerald-600",
//     icon: UserCheck,
//   },
//   {
//     category: "Equipment Rental",
//     amount: 1670,
//     percentage: 3.7,
//     color: "from-purple-500 to-purple-600",
//     icon: Dumbbell,
//   },
//   {
//     category: "Merchandise",
//     amount: 500,
//     percentage: 1.1,
//     color: "from-orange-500 to-orange-600",
//     icon: CreditCard,
//   },
// ];

const mockSystemAlerts = [
  {
    id: 1,
    type: "warning",
    title: "Equipment Maintenance Due",
    message: "3 treadmills require scheduled maintenance",
    time: "2 hours ago",
    priority: "medium",
    icon: AlertTriangle,
  },
  {
    id: 2,
    type: "info",
    title: "New Member Registration",
    message: "5 new members registered today",
    time: "4 hours ago",
    priority: "low",
    icon: UserCheck,
  },
  {
    id: 3,
    type: "error",
    title: "Payment Failed",
    message: "2 payment transactions failed processing",
    time: "6 hours ago",
    priority: "high",
    icon: XCircle,
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
    avatar: "JS",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 2,
    user: "Lisa Parker",
    action: "Updated equipment status",
    target: "Treadmill #5",
    time: "15 minutes ago",
    type: "update",
    avatar: "LP",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: 3,
    user: "Mike Johnson",
    action: "Processed payment",
    target: "Member #1247",
    time: "32 minutes ago",
    type: "payment",
    avatar: "MJ",
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: 4,
    user: "Admin",
    action: "Generated monthly report",
    target: "Revenue Analytics",
    time: "1 hour ago",
    type: "report",
    avatar: "AD",
    color: "bg-orange-100 text-orange-700",
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
    avatar: "LP",
    trend: "+12%",
    trendDirection: "up",
  },
  {
    id: 2,
    name: "John Smith",
    role: "Fitness Coach",
    clients: 38,
    revenue: 9800,
    rating: 4.8,
    avatar: "JS",
    trend: "+8%",
    trendDirection: "up",
  },
  {
    id: 3,
    name: "Emma Davis",
    role: "Yoga Instructor",
    clients: 32,
    revenue: 7600,
    rating: 4.9,
    avatar: "ED",
    trend: "+15%",
    trendDirection: "up",
  },
];

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState("month");
  const [maintenanceAlerts, setMaintenanceAlerts] = useState<any[]>([]);

  const [equipmentStats, setEquipmentStats] = useState<any>(null);
  const [selectedChart, setSelectedChart] = useState("revenue");
  const [chartsLoaded, setChartsLoaded] = useState(false);

  // Fetch maintenance alerts and equipment stats
  const fetchMaintenanceAlerts = async () => {
    try {
      const response = await userAPI.getEquipmentStats();
      const data = response.data as any;

      setEquipmentStats(data.stats);

      // Create maintenance alerts from real data
      const alerts = [];

      // Add maintenance due alerts
      if (data.maintenanceDue && data.maintenanceDue.length > 0) {
        alerts.push({
          id: 1,
          type: "warning",
          title: "Equipment Maintenance Due",
          message: `${data.maintenanceDue.length} equipment items require scheduled maintenance`,
          time: "Recently",
          priority: "medium",
          icon: AlertTriangle,
        });
      }

      // Add equipment status alerts
      if (data.stats) {
        if (data.stats.maintenance > 0) {
          alerts.push({
            id: 2,
            type: "warning",
            title: "Equipment Under Maintenance",
            message: `${data.stats.maintenance} equipment items are currently under maintenance`,
            time: "Currently",
            priority: "medium",
            icon: Wrench,
          });
        }

        if (data.stats.outOfService > 0) {
          alerts.push({
            id: 3,
            type: "error",
            title: "Equipment Out of Service",
            message: `${data.stats.outOfService} equipment items are out of service`,
            time: "Currently",
            priority: "high",
            icon: XCircle,
          });
        }
      }

      // Add default info alert if no maintenance issues
      if (alerts.length === 0) {
        alerts.push({
          id: 4,
          type: "info",
          title: "Equipment Status",
          message: "All equipment is operational and up to date",
          time: "Currently",
          priority: "low",
          icon: CheckCircle,
        });
      }

      setMaintenanceAlerts(alerts);
    } catch (error) {
      console.error("Error fetching maintenance alerts:", error);
      // Fallback to mock data if API fails
      setMaintenanceAlerts(mockSystemAlerts);
    } finally {
    }
  };

  useEffect(() => {
    fetchMaintenanceAlerts();
  }, []);

  useEffect(() => {
    setChartsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 dark:bg-slate-900/80 dark:border-slate-700/60">
        <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Welcome back, Administrator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></div>
            </div>

            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-white border rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>

            <button className="flex items-center gap-2 px-4 py-2 text-white transition-all rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 mx-auto space-y-8 max-w-7xl">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
          {/* Total Revenue */}
          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Total Revenue
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                    ${(mockAdminStats.monthlyRevenue / 1000).toFixed(1)}k
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 text-emerald-600">
                      <ArrowUp className="w-4 h-4" />
                      <span className="text-sm font-medium">+12.5%</span>
                    </div>
                    <span className="text-sm text-slate-500">
                      vs last month
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Members */}
          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Active Members
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                    {mockAdminStats.activeMembers}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 text-blue-600">
                      <ArrowUp className="w-4 h-4" />
                      <span className="text-sm font-medium">+8.2%</span>
                    </div>
                    <span className="text-sm text-slate-500">
                      vs last month
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Equipment Count */}
          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Equipment
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                    {equipmentStats
                      ? equipmentStats.total
                      : mockAdminStats.equipmentCount}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 text-purple-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {equipmentStats
                          ? Math.round(
                              (equipmentStats.operational /
                                equipmentStats.total) *
                                100
                            )
                          : 98}
                        %
                      </span>
                    </div>
                    <span className="text-sm text-slate-500">operational</span>
                  </div>
                  {equipmentStats && equipmentStats.maintenance > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Wrench className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {equipmentStats.maintenance}
                        </span>
                      </div>
                      <span className="text-sm text-slate-500">
                        in maintenance
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                  <Dumbbell className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    System Health
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                    {mockAdminStats.systemHealth}%
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Excellent</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                  <Server className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Members Management */}
          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Total Members
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                    {mockAdminStats.totalMembers}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUp className="w-4 h-4" />
                      <span className="text-sm font-medium">+15.3%</span>
                    </div>
                    <span className="text-sm text-slate-500">
                      vs last month
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 text-blue-600">
                      <UserCheck className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {mockAdminStats.activeMembers}
                      </span>
                    </div>
                    <span className="text-sm text-slate-500">active</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                  <UserCheck className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Charts and Analytics */}
          <div className="lg:col-span-2 space-y-8">
            {/* Interactive Charts Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Analytics Dashboard
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Interactive charts and data visualization
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedChart("revenue")}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        selectedChart === "revenue"
                          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      Revenue
                    </button>
                    <button
                      onClick={() => setSelectedChart("members")}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        selectedChart === "members"
                          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      Members
                    </button>
                    <button
                      onClick={() => setSelectedChart("activity")}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        selectedChart === "activity"
                          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      Activity
                    </button>
                    <div className="h-6 w-px bg-slate-300 dark:bg-slate-600"></div>
                    <button
                      onClick={() => {
                        const canvas = document.querySelector("canvas");
                        if (canvas) {
                          const link = document.createElement("a");
                          link.download = `${selectedChart}-chart.png`;
                          link.href = canvas.toDataURL();
                          link.click();
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                    >
                      <Download className="w-4 h-4 inline mr-1" />
                      Export
                    </button>
                  </div>
                </div>

                {/* Chart Statistics */}
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {selectedChart === "revenue" && (
                    <>
                      <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Total Revenue
                        </p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-white">
                          ${mockAdminStats.yearlyRevenue.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Monthly Avg
                        </p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-white">
                          $
                          {Math.round(
                            mockAdminStats.yearlyRevenue / 12
                          ).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Growth
                        </p>
                        <p className="text-lg font-semibold text-emerald-600">
                          +12.5%
                        </p>
                      </div>
                    </>
                  )}
                  {selectedChart === "members" && (
                    <>
                      <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Total Members
                        </p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-white">
                          {mockAdminStats.totalMembers.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Active Rate
                        </p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-white">
                          {Math.round(
                            (mockAdminStats.activeMembers /
                              mockAdminStats.totalMembers) *
                              100
                          )}
                          %
                        </p>
                      </div>
                      <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Growth
                        </p>
                        <p className="text-lg font-semibold text-blue-600">
                          +8.2%
                        </p>
                      </div>
                    </>
                  )}
                  {selectedChart === "activity" && (
                    <>
                      <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Avg Check-ins
                        </p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-white">
                          {Math.round(
                            weeklyActivityData.datasets[0].data.reduce(
                              (a, b) => a + b,
                              0
                            ) / 7
                          )}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Equipment Usage
                        </p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-white">
                          {Math.round(
                            weeklyActivityData.datasets[1].data.reduce(
                              (a, b) => a + b,
                              0
                            ) / 7
                          )}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Peak Day
                        </p>
                        <p className="text-lg font-semibold text-purple-600">
                          Thursday
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Chart Recommendations */}
                <div className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                        Actionable Insights
                      </p>
                      {selectedChart === "revenue" && (
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          Consider increasing marketing efforts in Q1 to boost
                          January revenue
                        </p>
                      )}
                      {selectedChart === "members" && (
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          Focus on member retention programs to maintain high
                          active rates
                        </p>
                      )}
                      {selectedChart === "activity" && (
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          Optimize staff scheduling for Thursday peak hours
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        💡
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart Comparison */}
                <div className="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                        Performance Insights
                      </p>
                      {selectedChart === "revenue" && (
                        <p className="text-xs text-indigo-600 dark:text-indigo-400">
                          Revenue is trending upward with a 12.5% increase this
                          month
                        </p>
                      )}
                      {selectedChart === "members" && (
                        <p className="text-xs text-indigo-600 dark:text-indigo-400">
                          Member growth is strong with high retention rates
                        </p>
                      )}
                      {selectedChart === "activity" && (
                        <p className="text-xs text-indigo-600 dark:text-indigo-400">
                          Peak activity on Thursdays suggests optimal scheduling
                          opportunities
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {selectedChart === "revenue" && (
                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                          ↗️
                        </div>
                      )}
                      {selectedChart === "members" && (
                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                          📈
                        </div>
                      )}
                      {selectedChart === "activity" && (
                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                          🎯
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Chart Performance Metrics */}
                <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                        Chart Performance
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-xs text-emerald-600 dark:text-emerald-400">
                            Rendering: Fast
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-xs text-blue-600 dark:text-blue-400">
                            Interactivity: High
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-xs text-purple-600 dark:text-purple-400">
                            Data Points:{" "}
                            {selectedChart === "revenue"
                              ? "24"
                              : selectedChart === "members"
                              ? "24"
                              : "14"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        {selectedChart === "revenue" && "Revenue Analysis"}
                        {selectedChart === "members" && "Member Growth"}
                        {selectedChart === "activity" && "Activity Patterns"}
                      </div>
                      <div className="text-xs text-emerald-500 dark:text-emerald-400">
                        Real-time updates
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart Data Summary */}
                <div className="mt-4 p-3 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-700/50 dark:to-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Data Summary
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        {selectedChart === "revenue" && (
                          <>
                            <div className="text-center">
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                Total Revenue
                              </p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                $
                                {monthlyRevenueData.datasets[0].data
                                  .reduce((a, b) => a + b, 0)
                                  .toLocaleString()}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                Avg Monthly
                              </p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                $
                                {Math.round(
                                  monthlyRevenueData.datasets[0].data.reduce(
                                    (a, b) => a + b,
                                    0
                                  ) / 12
                                ).toLocaleString()}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                Growth Rate
                              </p>
                              <p className="text-sm font-semibold text-emerald-600">
                                +
                                {(
                                  ((monthlyRevenueData.datasets[0].data[11] -
                                    monthlyRevenueData.datasets[0].data[0]) /
                                    monthlyRevenueData.datasets[0].data[0]) *
                                  100
                                ).toFixed(1)}
                                %
                              </p>
                            </div>
                          </>
                        )}
                        {selectedChart === "members" && (
                          <>
                            <div className="text-center">
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                Total New
                              </p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                {memberGrowthData.datasets[0].data
                                  .reduce((a, b) => a + b, 0)
                                  .toLocaleString()}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                Avg Monthly
                              </p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                {Math.round(
                                  memberGrowthData.datasets[0].data.reduce(
                                    (a, b) => a + b,
                                    0
                                  ) / 12
                                )}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                Peak Month
                              </p>
                              <p className="text-sm font-semibold text-blue-600">
                                {
                                  memberGrowthData.labels[
                                    memberGrowthData.datasets[0].data.indexOf(
                                      Math.max(
                                        ...memberGrowthData.datasets[0].data
                                      )
                                    )
                                  ]
                                }
                              </p>
                            </div>
                          </>
                        )}
                        {selectedChart === "activity" && (
                          <>
                            <div className="text-center">
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                Total Check-ins
                              </p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                {weeklyActivityData.datasets[0].data
                                  .reduce((a, b) => a + b, 0)
                                  .toLocaleString()}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                Avg Daily
                              </p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                {Math.round(
                                  weeklyActivityData.datasets[0].data.reduce(
                                    (a, b) => a + b,
                                    0
                                  ) / 7
                                )}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                Peak Day
                              </p>
                              <p className="text-sm font-semibold text-purple-600">
                                {
                                  weeklyActivityData.labels[
                                    weeklyActivityData.datasets[0].data.indexOf(
                                      Math.max(
                                        ...weeklyActivityData.datasets[0].data
                                      )
                                    )
                                  ]
                                }
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        Data Points
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {selectedChart === "revenue" &&
                          `${monthlyRevenueData.labels.length} months`}
                        {selectedChart === "members" &&
                          `${memberGrowthData.labels.length} months`}
                        {selectedChart === "activity" &&
                          `${weeklyActivityData.labels.length} days`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart Trends */}
                <div className="mt-4 p-3 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-rose-700 dark:text-rose-300">
                        Trend Analysis
                      </p>
                      {selectedChart === "revenue" && (
                        <p className="text-xs text-rose-600 dark:text-rose-400">
                          Strong upward trend with seasonal variations. Q4 shows
                          highest performance.
                        </p>
                      )}
                      {selectedChart === "members" && (
                        <p className="text-xs text-rose-600 dark:text-rose-400">
                          Consistent growth pattern with summer months showing
                          peak activity.
                        </p>
                      )}
                      {selectedChart === "activity" && (
                        <p className="text-xs text-rose-600 dark:text-rose-400">
                          Mid-week peak suggests optimal timing for special
                          events and promotions.
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                        📊
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart Forecast */}
                <div className="mt-4 p-3 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-cyan-700 dark:text-cyan-300">
                        Forecast & Predictions
                      </p>
                      {selectedChart === "revenue" && (
                        <p className="text-xs text-cyan-600 dark:text-cyan-400">
                          Projected 15% growth next quarter based on current
                          trends.
                        </p>
                      )}
                      {selectedChart === "members" && (
                        <p className="text-xs text-cyan-600 dark:text-cyan-400">
                          Expected 200+ new members next month with current
                          growth rate.
                        </p>
                      )}
                      {selectedChart === "activity" && (
                        <p className="text-xs text-cyan-600 dark:text-cyan-400">
                          Weekend activity expected to increase by 25% with new
                          programs.
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                        🔮
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart Comparison */}
                <div className="mt-4 p-3 bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-violet-700 dark:text-violet-300">
                        Benchmark Comparison
                      </p>
                      {selectedChart === "revenue" && (
                        <p className="text-xs text-violet-600 dark:text-violet-400">
                          Revenue growth exceeds industry average by 8.5%.
                        </p>
                      )}
                      {selectedChart === "members" && (
                        <p className="text-xs text-violet-600 dark:text-violet-400">
                          Member retention rate is 15% above industry standard.
                        </p>
                      )}
                      {selectedChart === "activity" && (
                        <p className="text-xs text-violet-600 dark:text-violet-400">
                          Facility utilization is 12% higher than similar gyms.
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                        🏆
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart Summary */}
                <div className="mt-4 p-3 bg-gradient-to-r from-lime-50 to-green-50 dark:from-lime-900/20 dark:to-green-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-lime-700 dark:text-lime-300">
                        Key Takeaways
                      </p>
                      {selectedChart === "revenue" && (
                        <p className="text-xs text-lime-600 dark:text-lime-400">
                          Strong financial performance with consistent growth
                          and target achievement.
                        </p>
                      )}
                      {selectedChart === "members" && (
                        <p className="text-xs text-lime-600 dark:text-lime-400">
                          Excellent member acquisition and retention strategies
                          are working effectively.
                        </p>
                      )}
                      {selectedChart === "activity" && (
                        <p className="text-xs text-lime-600 dark:text-lime-400">
                          High facility utilization indicates successful member
                          engagement programs.
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-lime-600 dark:text-lime-400">
                        ✅
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart Actions */}
                <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-orange-700 dark:text-orange-300">
                        Recommended Actions
                      </p>
                      {selectedChart === "revenue" && (
                        <p className="text-xs text-orange-600 dark:text-orange-400">
                          Increase Q1 marketing budget and launch seasonal
                          promotions.
                        </p>
                      )}
                      {selectedChart === "members" && (
                        <p className="text-xs text-orange-600 dark:text-orange-400">
                          Implement referral program and enhance member
                          benefits.
                        </p>
                      )}
                      {selectedChart === "activity" && (
                        <p className="text-xs text-orange-600 dark:text-orange-400">
                          Add weekend classes and extend peak hour availability.
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        🚀
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart Metrics */}
                <div className="mt-4 p-3 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-sky-700 dark:text-sky-300">
                        Performance Metrics
                      </p>
                      {selectedChart === "revenue" && (
                        <p className="text-xs text-sky-600 dark:text-sky-400">
                          Revenue per member: $367 | Growth rate: 12.5% | Target
                          achievement: 98%
                        </p>
                      )}
                      {selectedChart === "members" && (
                        <p className="text-xs text-sky-600 dark:text-sky-400">
                          New member conversion: 78% | Retention rate: 92% | Avg
                          lifetime: 18 months
                        </p>
                      )}
                      {selectedChart === "activity" && (
                        <p className="text-xs text-sky-600 dark:text-sky-400">
                          Facility utilization: 78% | Peak efficiency: 89% |
                          Member satisfaction: 4.8/5
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                        📈
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="h-80">
                  {!chartsLoaded ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-slate-500 dark:text-slate-400">
                          Loading charts...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {selectedChart === "revenue" && (
                        <Line
                          data={monthlyRevenueData}
                          options={lineChartOptions}
                          fallbackContent={
                            <div className="flex items-center justify-center h-full text-slate-500">
                              Loading chart...
                            </div>
                          }
                        />
                      )}
                      {selectedChart === "members" && (
                        <Bar
                          data={memberGrowthData}
                          options={barChartOptions}
                          fallbackContent={
                            <div className="flex items-center justify-center h-full text-slate-500">
                              Loading chart...
                            </div>
                          }
                        />
                      )}
                      {selectedChart === "activity" && (
                        <Line
                          data={weeklyActivityData}
                          options={lineChartOptions}
                          fallbackContent={
                            <div className="flex items-center justify-center h-full text-slate-500">
                              Loading chart...
                            </div>
                          }
                        />
                      )}
                    </>
                  )}
                </div>

                {/* Chart Insights */}
                {chartsLoaded && (
                  <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                      Chart Insights
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedChart === "revenue" && (
                        <>
                          <div className="text-center">
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              Peak Month
                            </p>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              July ($52,000)
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              Lowest Month
                            </p>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              January ($32,000)
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              Trend
                            </p>
                            <p className="text-sm font-medium text-emerald-600">
                              ↗️ Upward
                            </p>
                          </div>
                        </>
                      )}
                      {selectedChart === "members" && (
                        <>
                          <div className="text-center">
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              Growth Rate
                            </p>
                            <p className="text-sm font-medium text-blue-600">
                              +15.2%
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              Active Ratio
                            </p>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              71.5%
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              Retention
                            </p>
                            <p className="text-sm font-medium text-emerald-600">
                              High
                            </p>
                          </div>
                        </>
                      )}
                      {selectedChart === "activity" && (
                        <>
                          <div className="text-center">
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              Busiest Day
                            </p>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              Thursday
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              Peak Hours
                            </p>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              6-8 PM
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              Utilization
                            </p>
                            <p className="text-sm font-medium text-purple-600">
                              78%
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Data Table View */}
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          Data Table
                        </h5>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {selectedChart === "revenue" &&
                              `${monthlyRevenueData.labels.length} months`}
                            {selectedChart === "members" &&
                              `${memberGrowthData.labels.length} months`}
                            {selectedChart === "activity" &&
                              `${weeklyActivityData.labels.length} days`}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                let csvContent = "";
                                if (selectedChart === "revenue") {
                                  csvContent = "Month,Revenue,Target\n";
                                  monthlyRevenueData.labels.forEach(
                                    (label, index) => {
                                      csvContent += `${label},${monthlyRevenueData.datasets[0].data[index]},${monthlyRevenueData.datasets[1].data[index]}\n`;
                                    }
                                  );
                                } else if (selectedChart === "members") {
                                  csvContent =
                                    "Month,New Members,Active Members\n";
                                  memberGrowthData.labels.forEach(
                                    (label, index) => {
                                      csvContent += `${label},${memberGrowthData.datasets[0].data[index]},${memberGrowthData.datasets[1].data[index]}\n`;
                                    }
                                  );
                                } else if (selectedChart === "activity") {
                                  csvContent =
                                    "Day,Check-ins,Equipment Usage\n";
                                  weeklyActivityData.labels.forEach(
                                    (label, index) => {
                                      csvContent += `${label},${weeklyActivityData.datasets[0].data[index]},${weeklyActivityData.datasets[1].data[index]}\n`;
                                    }
                                  );
                                }

                                const blob = new Blob([csvContent], {
                                  type: "text/csv",
                                });
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `${selectedChart}-data.csv`;
                                a.click();
                                window.URL.revokeObjectURL(url);
                              }}
                              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium px-2 py-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                            >
                              CSV
                            </button>
                            <button
                              onClick={() => {
                                const canvas = document.querySelector("canvas");
                                if (canvas) {
                                  const link = document.createElement("a");
                                  link.download = `${selectedChart}-chart.png`;
                                  link.href = canvas.toDataURL("image/png");
                                  link.click();
                                }
                              }}
                              className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium px-2 py-1 rounded hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                            >
                              PNG
                            </button>
                            <button
                              onClick={() => {
                                const canvas = document.querySelector("canvas");
                                if (canvas) {
                                  const link = document.createElement("a");
                                  link.download = `${selectedChart}-chart.pdf`;
                                  link.href =
                                    canvas.toDataURL("application/pdf");
                                  link.click();
                                }
                              }}
                              className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium px-2 py-1 rounded hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                            >
                              PDF
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="max-h-32 overflow-y-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-slate-600 dark:text-slate-400">
                              {selectedChart === "revenue" && (
                                <>
                                  <th className="text-left py-1">Month</th>
                                  <th className="text-right py-1">Revenue</th>
                                  <th className="text-right py-1">Target</th>
                                  <th className="text-right py-1">Variance</th>
                                </>
                              )}
                              {selectedChart === "members" && (
                                <>
                                  <th className="text-left py-1">Month</th>
                                  <th className="text-right py-1">New</th>
                                  <th className="text-right py-1">Active</th>
                                  <th className="text-right py-1">Growth</th>
                                </>
                              )}
                              {selectedChart === "activity" && (
                                <>
                                  <th className="text-left py-1">Day</th>
                                  <th className="text-right py-1">Check-ins</th>
                                  <th className="text-right py-1">Equipment</th>
                                  <th className="text-right py-1">
                                    Efficiency
                                  </th>
                                </>
                              )}
                            </tr>
                          </thead>
                          <tbody className="text-slate-700 dark:text-slate-300">
                            {selectedChart === "revenue" &&
                              monthlyRevenueData.labels.map((label, index) => {
                                const revenue =
                                  monthlyRevenueData.datasets[0].data[index];
                                const target =
                                  monthlyRevenueData.datasets[1].data[index];
                                const variance = (
                                  ((revenue - target) / target) *
                                  100
                                ).toFixed(1);
                                return (
                                  <tr
                                    key={index}
                                    className="border-t border-slate-100 dark:border-slate-600"
                                  >
                                    <td className="py-1">{label}</td>
                                    <td className="text-right py-1">
                                      ${revenue.toLocaleString()}
                                    </td>
                                    <td className="text-right py-1">
                                      ${target.toLocaleString()}
                                    </td>
                                    <td
                                      className={`text-right py-1 font-medium ${
                                        parseFloat(variance) >= 0
                                          ? "text-emerald-600"
                                          : "text-red-600"
                                      }`}
                                    >
                                      {parseFloat(variance) >= 0 ? "+" : ""}
                                      {variance}%
                                    </td>
                                  </tr>
                                );
                              })}
                            {selectedChart === "members" &&
                              memberGrowthData.labels.map((label, index) => {
                                const newMembers =
                                  memberGrowthData.datasets[0].data[index];
                                const activeMembers =
                                  memberGrowthData.datasets[1].data[index];
                                const growth =
                                  index > 0
                                    ? (
                                        ((newMembers -
                                          memberGrowthData.datasets[0].data[
                                            index - 1
                                          ]) /
                                          memberGrowthData.datasets[0].data[
                                            index - 1
                                          ]) *
                                        100
                                      ).toFixed(1)
                                    : "0.0";
                                return (
                                  <tr
                                    key={index}
                                    className="border-t border-slate-100 dark:border-slate-600"
                                  >
                                    <td className="py-1">{label}</td>
                                    <td className="text-right py-1">
                                      {newMembers}
                                    </td>
                                    <td className="text-right py-1">
                                      {activeMembers}
                                    </td>
                                    <td
                                      className={`text-right py-1 font-medium ${
                                        parseFloat(growth) >= 0
                                          ? "text-emerald-600"
                                          : "text-red-600"
                                      }`}
                                    >
                                      {parseFloat(growth) >= 0 ? "+" : ""}
                                      {growth}%
                                    </td>
                                  </tr>
                                );
                              })}
                            {selectedChart === "activity" &&
                              weeklyActivityData.labels.map((label, index) => {
                                const checkins =
                                  weeklyActivityData.datasets[0].data[index];
                                const equipment =
                                  weeklyActivityData.datasets[1].data[index];
                                const efficiency = (
                                  (equipment / checkins) *
                                  100
                                ).toFixed(1);
                                return (
                                  <tr
                                    key={index}
                                    className="border-t border-slate-100 dark:border-slate-600"
                                  >
                                    <td className="py-1">{label}</td>
                                    <td className="text-right py-1">
                                      {checkins}
                                    </td>
                                    <td className="text-right py-1">
                                      {equipment}
                                    </td>
                                    <td className="text-right py-1 font-medium text-blue-600">
                                      {efficiency}%
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Revenue Breakdown with Chart */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Revenue Breakdown
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Revenue distribution by category
                  </p>
                </div>
                <div className="p-6">
                  <div className="h-64">
                    {!chartsLoaded ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : (
                      <Doughnut
                        data={revenueBreakdownData}
                        options={doughnutChartOptions}
                        fallbackContent={
                          <div className="flex items-center justify-center h-full text-slate-500">
                            Loading chart...
                          </div>
                        }
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Equipment Status
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Current equipment operational status
                  </p>
                </div>
                <div className="p-6">
                  <div className="h-64">
                    {!chartsLoaded ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      </div>
                    ) : (
                      <Doughnut
                        data={equipmentStatusData}
                        options={doughnutChartOptions}
                        fallbackContent={
                          <div className="flex items-center justify-center h-full text-slate-500">
                            Loading chart...
                          </div>
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* System Performance Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  System Performance
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Current vs peak resource usage
                </p>
              </div>
              <div className="p-6">
                <div className="h-64">
                  {!chartsLoaded ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : (
                    <Bar
                      data={systemPerformanceData}
                      options={barChartOptions}
                      fallbackContent={
                        <div className="flex items-center justify-center h-full text-slate-500">
                          Loading chart...
                        </div>
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions and Alerts */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Quick Actions
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-3">
                  <Link
                    to="/equipments/manage"
                    className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 transition-all group"
                  >
                    <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 mb-3 group-hover:scale-110 transition-transform">
                      <Dumbbell className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center">
                      Manage Equipment
                    </span>
                  </Link>

                  <Link
                    to="/auth/allusers"
                    className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-800/30 dark:hover:to-teal-800/30 transition-all group"
                  >
                    <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 mb-3 group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center">
                      Manage Users
                    </span>
                  </Link>

                  <Link
                    to="/members/manage"
                    className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-800/30 dark:hover:to-emerald-800/30 transition-all group"
                  >
                    <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 mb-3 group-hover:scale-110 transition-transform">
                      <UserCheck className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center">
                      Manage Members
                    </span>
                  </Link>

                  <Link
                    to="/payments/manage"
                    className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-800/30 dark:hover:to-pink-800/30 transition-all group"
                  >
                    <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 mb-3 group-hover:scale-110 transition-transform">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center">
                      View Payments
                    </span>
                  </Link>

                  <Link
                    to="/subscriptions"
                    className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 hover:from-orange-100 hover:to-red-100 dark:hover:from-orange-800/30 dark:hover:to-red-800/30 transition-all group"
                  >
                    <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 mb-3 group-hover:scale-110 transition-transform">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center">
                      Subscriptions
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Maintenance Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Maintenance Overview
                  </h3>
                  <Link
                    to="/equipments/dashboard"
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {equipmentStats ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Operational
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {equipmentStats.operational} equipment items
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      >
                        {Math.round(
                          (equipmentStats.operational / equipmentStats.total) *
                            100
                        )}
                        %
                      </Badge>
                    </div>

                    {equipmentStats.maintenance > 0 && (
                      <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center gap-3">
                          <Wrench className="w-5 h-5 text-yellow-600" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Under Maintenance
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {equipmentStats.maintenance} equipment items
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        >
                          {Math.round(
                            (equipmentStats.maintenance /
                              equipmentStats.total) *
                              100
                          )}
                          %
                        </Badge>
                      </div>
                    )}

                    {equipmentStats.outOfService > 0 && (
                      <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="flex items-center gap-3">
                          <XCircle className="w-5 h-5 text-red-600" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Out of Service
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {equipmentStats.outOfService} equipment items
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        >
                          {Math.round(
                            (equipmentStats.outOfService /
                              equipmentStats.total) *
                              100
                          )}
                          %
                        </Badge>
                      </div>
                    )}

                    <div className="pt-2 text-center">
                      <Link
                        to="/equipments/manage"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/20 dark:hover:bg-indigo-800/30 transition-colors"
                      >
                        <Wrench className="w-4 h-4" />
                        Manage Maintenance
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Wrench className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>Loading maintenance data...</p>
                  </div>
                )}
              </div>
            </div>

            {/* System Alerts */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    System Alerts
                  </h3>
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded-full">
                    {maintenanceAlerts.length} Active
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {maintenanceAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-xl border-l-4 ${
                        alert.type === "error"
                          ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                          : alert.type === "warning"
                          ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10"
                          : "border-blue-500 bg-blue-50 dark:bg-blue-900/10"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            alert.type === "error"
                              ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                              : alert.type === "warning"
                              ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
                              : "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                          }`}
                        >
                          <alert.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 dark:text-white">
                            {alert.title}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {alert.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {alert.time}
                            </span>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                alert.priority === "high"
                                  ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                                  : alert.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                                  : "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                              }`}
                            >
                              {alert.priority} priority
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Recent Activities and Top Performers */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Recent Activities */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Recent Activities
                </h3>
                <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockRecentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${activity.color}`}
                    >
                      {activity.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {activity.user}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {activity.action} - {activity.target}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Top Performers
                </h3>
                <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockTopPerformers.map((performer, index) => (
                  <div
                    key={performer.id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-center w-8 h-8">
                      {index === 0 && (
                        <Award className="w-5 h-5 text-yellow-500" />
                      )}
                      {index === 1 && (
                        <Award className="w-5 h-5 text-slate-400" />
                      )}
                      {index === 2 && (
                        <Award className="w-5 h-5 text-amber-600" />
                      )}
                    </div>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm bg-gradient-to-r from-indigo-500 to-purple-500 text-white`}
                    >
                      {performer.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {performer.name}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {performer.role}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-emerald-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {performer.trend}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        ${performer.revenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Administrative Features Section */}
      <div className="mt-8">
        <AdministrativeFeatures />
      </div>
    </div>
  );
};

export default AdminDashboard;
