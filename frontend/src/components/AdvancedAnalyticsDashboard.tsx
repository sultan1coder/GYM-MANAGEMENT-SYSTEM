import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "react-hot-toast";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Dumbbell,
  UserCheck,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Calendar,
  Target,
  Award,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download,
  Filter,
} from "lucide-react";

// Types and Interfaces
interface RevenueData {
  totalRevenue: number;
  monthlyRevenue: number[];
  revenueGrowth: number;
  averageOrderValue: number;
  topRevenueSources: Array<{
    name: string;
    amount: number;
    percentage: number;
    trend: "up" | "down";
  }>;
  revenueByCategory: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  seasonalTrends: Array<{
    month: string;
    revenue: number;
    growth: number;
  }>;
}

interface MemberGrowthData {
  totalMembers: number;
  activeMembers: number;
  newMembersThisMonth: number;
  churnRate: number;
  growthRate: number;
  monthlyGrowth: Array<{
    month: string;
    newMembers: number;
    totalMembers: number;
    growth: number;
  }>;
  membershipRetention: Array<{
    plan: string;
    retentionRate: number;
    averageLifespan: number;
    churnRisk: "low" | "medium" | "high";
  }>;
  demographicTrends: Array<{
    ageGroup: string;
    count: number;
    growth: number;
  }>;
}

interface EquipmentUtilizationData {
  totalEquipment: number;
  operationalEquipment: number;
  maintenanceRequired: number;
  utilizationRate: number;
  equipmentByCategory: Array<{
    category: string;
    count: number;
    utilization: number;
    maintenanceStatus: "operational" | "maintenance" | "out_of_service";
  }>;
  usageTrends: Array<{
    equipment: string;
    dailyUsage: number;
    weeklyUsage: number;
    monthlyUsage: number;
    efficiency: number;
  }>;
  maintenanceSchedule: Array<{
    equipment: string;
    lastMaintenance: string;
    nextMaintenance: string;
    status: "on_schedule" | "overdue" | "upcoming";
  }>;
}

interface StaffPerformanceData {
  totalStaff: number;
  activeStaff: number;
  averageProductivity: number;
  topPerformers: Array<{
    name: string;
    role: string;
    productivity: number;
    tasksCompleted: number;
    rating: number;
  }>;
  performanceMetrics: Array<{
    metric: string;
    current: number;
    target: number;
    achievement: number;
    trend: "up" | "down" | "stable";
  }>;
  activityLogs: Array<{
    staffId: string;
    name: string;
    activity: string;
    duration: number;
    timestamp: string;
    efficiency: number;
  }>;
}

const AdvancedAnalyticsDashboard: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState("revenue");
  const [timeRange, setTimeRange] = useState("month");
  const [selectedMetric, setSelectedMetric] = useState("overview");

  // Mock data (replace with real API calls)
  const [revenueData, setRevenueData] = useState<RevenueData>({
    totalRevenue: 1247500,
    monthlyRevenue: [
      45000, 47250, 52920, 57154, 65727, 80187, 94621, 118276, 153759, 196809,
      265691, 377281,
    ],
    revenueGrowth: 42.5,
    averageOrderValue: 89.5,
    topRevenueSources: [
      {
        name: "Premium Memberships",
        amount: 456000,
        percentage: 36.5,
        trend: "up",
      },
      {
        name: "Personal Training",
        amount: 234000,
        percentage: 18.8,
        trend: "up",
      },
      {
        name: "Equipment Sales",
        amount: 189000,
        percentage: 15.2,
        trend: "down",
      },
      { name: "Supplements", amount: 156000, percentage: 12.5, trend: "up" },
    ],
    revenueByCategory: [
      { category: "Memberships", amount: 789000, percentage: 63.3 },
      { category: "Services", amount: 234000, percentage: 18.8 },
      { category: "Products", amount: 156000, percentage: 12.5 },
      { category: "Other", amount: 68000, percentage: 5.4 },
    ],
    seasonalTrends: [
      { month: "Jan", revenue: 45000, growth: 0 },
      { month: "Feb", revenue: 47250, growth: 5 },
      { month: "Mar", revenue: 52920, growth: 12 },
      { month: "Apr", revenue: 57154, growth: 8 },
      { month: "May", revenue: 65727, growth: 15 },
      { month: "Jun", revenue: 80187, growth: 22 },
      { month: "Jul", revenue: 94621, growth: 18 },
      { month: "Aug", revenue: 118276, growth: 25 },
      { month: "Sep", revenue: 153759, growth: 30 },
      { month: "Oct", revenue: 196809, growth: 28 },
      { month: "Nov", revenue: 265691, growth: 35 },
      { month: "Dec", revenue: 377281, growth: 42 },
    ],
  });

  const [memberGrowthData, setMemberGrowthData] = useState<MemberGrowthData>({
    totalMembers: 1247,
    activeMembers: 1189,
    newMembersThisMonth: 89,
    churnRate: 4.7,
    growthRate: 42.5,
    monthlyGrowth: [
      { month: "Jan", newMembers: 45, totalMembers: 876, growth: 5.4 },
      { month: "Feb", newMembers: 52, totalMembers: 928, growth: 5.9 },
      { month: "Mar", newMembers: 67, totalMembers: 995, growth: 7.2 },
      { month: "Apr", newMembers: 58, totalMembers: 1053, growth: 5.8 },
      { month: "May", newMembers: 73, totalMembers: 1126, growth: 6.9 },
      { month: "Jun", newMembers: 89, totalMembers: 1215, growth: 7.9 },
      { month: "Jul", newMembers: 76, totalMembers: 1291, growth: 6.3 },
      { month: "Aug", newMembers: 94, totalMembers: 1385, growth: 7.3 },
      { month: "Sep", newMembers: 87, totalMembers: 1472, growth: 6.3 },
      { month: "Oct", newMembers: 103, totalMembers: 1575, growth: 7.0 },
      { month: "Nov", newMembers: 98, totalMembers: 1673, growth: 6.2 },
      { month: "Dec", newMembers: 112, totalMembers: 1785, growth: 6.7 },
    ],
    membershipRetention: [
      {
        plan: "Premium Monthly",
        retentionRate: 94.2,
        averageLifespan: 18.5,
        churnRisk: "low",
      },
      {
        plan: "Standard Monthly",
        retentionRate: 87.6,
        averageLifespan: 12.3,
        churnRisk: "medium",
      },
      {
        plan: "Daily Pass",
        retentionRate: 23.4,
        averageLifespan: 2.1,
        churnRisk: "high",
      },
      {
        plan: "Annual",
        retentionRate: 96.8,
        averageLifespan: 24.0,
        churnRisk: "low",
      },
    ],
    demographicTrends: [
      { ageGroup: "18-25", count: 234, growth: 15.2 },
      { ageGroup: "26-35", count: 456, growth: 28.7 },
      { ageGroup: "36-45", count: 389, growth: 24.5 },
      { ageGroup: "46-55", count: 123, growth: 7.8 },
      { ageGroup: "55+", count: 45, growth: 2.8 },
    ],
  });

  const [equipmentUtilizationData, setEquipmentUtilizationData] =
    useState<EquipmentUtilizationData>({
      totalEquipment: 156,
      operationalEquipment: 148,
      maintenanceRequired: 8,
      utilizationRate: 78.5,
      equipmentByCategory: [
        {
          category: "Cardio Machines",
          count: 45,
          utilization: 82.3,
          maintenanceStatus: "operational",
        },
        {
          category: "Strength Training",
          count: 67,
          utilization: 76.8,
          maintenanceStatus: "operational",
        },
        {
          category: "Free Weights",
          count: 23,
          utilization: 89.2,
          maintenanceStatus: "operational",
        },
        {
          category: "Functional Training",
          count: 21,
          utilization: 71.5,
          maintenanceStatus: "maintenance",
        },
      ],
      usageTrends: [
        {
          equipment: "Treadmill",
          dailyUsage: 156,
          weeklyUsage: 1092,
          monthlyUsage: 4680,
          efficiency: 87.5,
        },
        {
          equipment: "Elliptical",
          dailyUsage: 134,
          weeklyUsage: 938,
          monthlyUsage: 4020,
          efficiency: 82.3,
        },
        {
          equipment: "Bench Press",
          dailyUsage: 89,
          weeklyUsage: 623,
          monthlyUsage: 2670,
          efficiency: 76.8,
        },
        {
          equipment: "Squat Rack",
          dailyUsage: 67,
          weeklyUsage: 469,
          monthlyUsage: 2010,
          efficiency: 71.2,
        },
      ],
      maintenanceSchedule: [
        {
          equipment: "Treadmill #3",
          lastMaintenance: "2024-01-01",
          nextMaintenance: "2024-02-01",
          status: "upcoming",
        },
        {
          equipment: "Elliptical #2",
          lastMaintenance: "2023-12-15",
          nextMaintenance: "2024-01-15",
          status: "overdue",
        },
        {
          equipment: "Bench Press #1",
          lastMaintenance: "2024-01-10",
          nextMaintenance: "2024-02-10",
          status: "upcoming",
        },
        {
          equipment: "Squat Rack #2",
          lastMaintenance: "2024-01-05",
          nextMaintenance: "2024-02-05",
          status: "upcoming",
        },
      ],
    });

  const [staffPerformanceData, setStaffPerformanceData] =
    useState<StaffPerformanceData>({
      totalStaff: 24,
      activeStaff: 22,
      averageProductivity: 87.3,
      topPerformers: [
        {
          name: "Sarah Johnson",
          role: "Personal Trainer",
          productivity: 94.2,
          tasksCompleted: 156,
          rating: 4.9,
        },
        {
          name: "Mike Chen",
          role: "Fitness Coach",
          productivity: 91.8,
          tasksCompleted: 142,
          rating: 4.8,
        },
        {
          name: "Lisa Rodriguez",
          role: "Receptionist",
          productivity: 89.5,
          tasksCompleted: 189,
          rating: 4.7,
        },
        {
          name: "David Kim",
          role: "Maintenance",
          productivity: 87.3,
          tasksCompleted: 67,
          rating: 4.6,
        },
      ],
      performanceMetrics: [
        {
          metric: "Task Completion",
          current: 87.3,
          target: 90.0,
          achievement: 97.0,
          trend: "up",
        },
        {
          metric: "Customer Satisfaction",
          current: 4.6,
          target: 4.5,
          achievement: 102.2,
          trend: "up",
        },
        {
          metric: "Attendance Rate",
          current: 94.2,
          target: 95.0,
          achievement: 99.2,
          trend: "stable",
        },
        {
          metric: "Training Completion",
          current: 78.9,
          target: 85.0,
          achievement: 92.8,
          trend: "up",
        },
      ],
      activityLogs: [
        {
          staffId: "ST001",
          name: "Sarah Johnson",
          activity: "Personal Training Session",
          duration: 60,
          timestamp: "2024-01-15 14:00",
          efficiency: 94.2,
        },
        {
          staffId: "FC002",
          name: "Mike Chen",
          activity: "Group Fitness Class",
          duration: 45,
          timestamp: "2024-01-15 15:00",
          efficiency: 91.8,
        },
        {
          staffId: "RC003",
          name: "Lisa Rodriguez",
          activity: "Member Check-in",
          duration: 5,
          timestamp: "2024-01-15 15:30",
          efficiency: 89.5,
        },
        {
          staffId: "MT004",
          name: "David Kim",
          activity: "Equipment Maintenance",
          duration: 120,
          timestamp: "2024-01-15 16:00",
          efficiency: 87.3,
        },
      ],
    });

  // Event handlers
  const handleExportData = (type: string) => {
    toast.success(`${type} data exported successfully!`);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedMetric(filter);
    toast.success(`Filter changed to ${filter}`);
  };

  // Update data periodically (simulate real-time updates)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setRevenueData((prev) => ({
        ...prev,
        totalRevenue: prev.totalRevenue + Math.floor(Math.random() * 1000),
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case "down":
        return <ArrowDownRight className="h-4 w-4 text-red-600" />;
      default:
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
      case "on_schedule":
      case "low":
        return "bg-green-100 text-green-800";
      case "maintenance":
      case "upcoming":
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "out_of_service":
      case "overdue":
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Advanced Analytics Dashboard
          </h2>
          <p className="text-gray-600">
            Comprehensive insights into gym performance and trends
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
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Revenue Analytics
          </TabsTrigger>
          <TabsTrigger value="growth" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Member Growth
          </TabsTrigger>
          <TabsTrigger value="equipment" className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4" />
            Equipment
          </TabsTrigger>
          <TabsTrigger value="staff" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Staff Performance
          </TabsTrigger>
        </TabsList>

        {/* Revenue Analytics Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${revenueData.totalRevenue.toLocaleString()}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {getTrendIcon("up")}
                  <span className="text-sm text-green-600">
                    +{revenueData.revenueGrowth}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Revenue
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {revenueData.monthlyRevenue[
                    revenueData.monthlyRevenue.length - 1
                  ]?.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Current month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Order Value
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${revenueData.averageOrderValue}
                </div>
                <p className="text-xs text-muted-foreground">Per transaction</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Growth Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {revenueData.revenueGrowth}%
                </div>
                <p className="text-xs text-muted-foreground">Year over year</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Revenue Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueData.topRevenueSources.map((source, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {getTrendIcon(source.trend)}
                        <div>
                          <p className="font-medium">{source.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {source.percentage}% of total
                          </p>
                        </div>
                      </div>
                      <span className="font-bold">
                        ${source.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueData.revenueByCategory.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {category.category}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {category.percentage}%
                        </span>
                      </div>
                      <Progress value={category.percentage} />
                      <p className="text-xs text-muted-foreground">
                        ${category.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Member Growth Trends Tab */}
        <TabsContent value="growth" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Members
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {memberGrowthData.totalMembers.toLocaleString()}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {getTrendIcon("up")}
                  <span className="text-sm text-green-600">
                    +{memberGrowthData.growthRate}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Members
                </CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {memberGrowthData.activeMembers.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {(
                    (memberGrowthData.activeMembers /
                      memberGrowthData.totalMembers) *
                    100
                  ).toFixed(1)}
                  % active rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  New This Month
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {memberGrowthData.newMembersThisMonth}
                </div>
                <p className="text-xs text-muted-foreground">New signups</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Churn Rate
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {memberGrowthData.churnRate}%
                </div>
                <p className="text-xs text-muted-foreground">Monthly churn</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Membership Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {memberGrowthData.membershipRetention.map((plan, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{plan.plan}</span>
                        <Badge className={getStatusColor(plan.churnRisk)}>
                          {plan.churnRisk} risk
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Retention: {plan.retentionRate}%</span>
                        <span>Avg lifespan: {plan.averageLifespan} months</span>
                      </div>
                      <Progress value={plan.retentionRate} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Demographic Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {memberGrowthData.demographicTrends.map((demo, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{demo.ageGroup}</p>
                        <p className="text-sm text-muted-foreground">
                          {demo.count} members
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon("up")}
                        <span className="text-sm text-green-600">
                          +{demo.growth}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Equipment Utilization Tab */}
        <TabsContent value="equipment" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Equipment
                </CardTitle>
                <Dumbbell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {equipmentUtilizationData.totalEquipment}
                </div>
                <p className="text-xs text-muted-foreground">All equipment</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Operational
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {equipmentUtilizationData.operationalEquipment}
                </div>
                <p className="text-xs text-muted-foreground">Ready to use</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Maintenance
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {equipmentUtilizationData.maintenanceRequired}
                </div>
                <p className="text-xs text-muted-foreground">Needs attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Utilization Rate
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {equipmentUtilizationData.utilizationRate}%
                </div>
                <p className="text-xs text-muted-foreground">Average usage</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Equipment by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {equipmentUtilizationData.equipmentByCategory.map(
                    (category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {category.category}
                          </span>
                          <Badge
                            className={getStatusColor(
                              category.maintenanceStatus
                            )}
                          >
                            {category.maintenanceStatus.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>{category.count} units</span>
                          <span>{category.utilization}% utilization</span>
                        </div>
                        <Progress value={category.utilization} />
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {equipmentUtilizationData.maintenanceSchedule.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{item.equipment}</p>
                          <p className="text-sm text-muted-foreground">
                            Next: {item.nextMaintenance}
                          </p>
                        </div>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status.replace("_", " ")}
                        </Badge>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Staff Performance Tab */}
        <TabsContent value="staff" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Staff
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {staffPerformanceData.totalStaff}
                </div>
                <p className="text-xs text-muted-foreground">All employees</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Staff
                </CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {staffPerformanceData.activeStaff}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently working
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Productivity
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {staffPerformanceData.averageProductivity}%
                </div>
                <p className="text-xs text-muted-foreground">Team average</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Performance
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.6/5.0</div>
                <p className="text-xs text-muted-foreground">Customer rating</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {staffPerformanceData.topPerformers.map(
                    (performer, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{performer.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {performer.role}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs">
                              Rating: {performer.rating}/5.0
                            </span>
                            <span className="text-xs">
                              Tasks: {performer.tasksCompleted}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            {performer.productivity}%
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Productivity
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {staffPerformanceData.performanceMetrics.map(
                    (metric, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{metric.metric}</span>
                          <div className="flex items-center gap-2">
                            {getTrendIcon(metric.trend)}
                            <span className="text-sm">
                              {metric.achievement}%
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Current: {metric.current}</span>
                          <span>Target: {metric.target}</span>
                        </div>
                        <Progress
                          value={(metric.current / metric.target) * 100}
                        />
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;
