import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/common/DateRangePicker";
import { cn } from "@/lib/utils";

// Mock data for demonstration
const mockAnalyticsData = {
  overview: {
    totalMembers: 1247,
    activeMembers: 1089,
    newMembersThisMonth: 89,
    revenueThisMonth: 45670,
    averageSessionLength: 45,
    peakHours: "6-8 PM",
    memberRetentionRate: 87.5,
  },
  revenue: {
    monthly: [
      { month: "Jan", revenue: 42000, members: 1200 },
      { month: "Feb", revenue: 43500, members: 1215 },
      { month: "Mar", revenue: 45100, members: 1230 },
      { month: "Apr", revenue: 45670, members: 1247 },
    ],
    daily: Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      revenue: Math.floor(Math.random() * 2000) + 1000,
      checkIns: Math.floor(Math.random() * 50) + 20,
    })),
  },
  members: {
    ageDistribution: [
      { age: "18-25", count: 234, percentage: 18.8 },
      { age: "26-35", count: 456, percentage: 36.6 },
      { age: "36-45", count: 312, percentage: 25.0 },
      { age: "46-55", count: 178, percentage: 14.3 },
      { age: "55+", count: 67, percentage: 5.4 },
    ],
    membershipTypes: [
      { type: "Monthly", count: 892, percentage: 71.5 },
      { type: "Daily", count: 355, percentage: 28.5 },
    ],
    newVsReturning: {
      new: 89,
      returning: 1158,
    },
  },
  equipment: {
    usage: [
      { name: "Treadmills", usage: 85, maintenance: "Good" },
      { name: "Weight Machines", usage: 72, maintenance: "Good" },
      { name: "Free Weights", usage: 91, maintenance: "Excellent" },
      { name: "Cardio Equipment", usage: 78, maintenance: "Good" },
      { name: "Yoga Mats", usage: 45, maintenance: "Fair" },
    ],
    maintenance: [
      {
        equipment: "Treadmill #1",
        lastService: "2024-01-15",
        nextDue: "2024-02-15",
        status: "Good",
      },
      {
        equipment: "Weight Bench #2",
        lastService: "2024-01-10",
        nextDue: "2024-02-10",
        status: "Good",
      },
      {
        equipment: "Elliptical #3",
        lastService: "2024-01-20",
        nextDue: "2024-02-20",
        status: "Good",
      },
    ],
  },
  attendance: {
    hourly: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      checkIns: Math.floor(Math.random() * 30) + 5,
    })),
    weekly: [
      { day: "Mon", checkIns: 156 },
      { day: "Tue", checkIns: 189 },
      { day: "Wed", checkIns: 203 },
      { day: "Thu", checkIns: 178 },
      { day: "Fri", checkIns: 234 },
      { day: "Sat", checkIns: 145 },
      { day: "Sun", checkIns: 98 },
    ],
  },
};

interface AnalyticsDashboardProps {
  className?: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  className,
}) => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const [isLoading, setIsLoading] = useState(false);
  const [showRawData, setShowRawData] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleExport = () => {
    // Export analytics data
    const dataStr = JSON.stringify(mockAnalyticsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analytics-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive insights into your gym's performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRawData(!showRawData)}
          >
            {showRawData ? (
              <EyeOff className="w-4 h-4 mr-2" />
            ) : (
              <Eye className="w-4 h-4 mr-2" />
            )}
            {showRawData ? "Hide" : "Show"} Raw Data
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                Date Range
              </label>
              <DatePickerWithRange
                value={dateRange}
                onChange={setDateRange} className="w-full"
              />
            </div>
            <div className="sm:w-48">
              <label className="text-sm font-medium mb-2 block">
                Primary Metric
              </label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="members">Members</SelectItem>
                  <SelectItem value="attendance">Attendance</SelectItem>
                  <SelectItem value="equipment">Equipment Usage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAnalyticsData.overview.totalMembers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +{mockAnalyticsData.overview.newMembersThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${mockAnalyticsData.overview.revenueThisMonth.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Retention Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAnalyticsData.overview.memberRetentionRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              +2.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Hours</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAnalyticsData.overview.peakHours}
            </div>
            <p className="text-xs text-muted-foreground">
              Average session: {mockAnalyticsData.overview.averageSessionLength}
              min
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
                <CardDescription>
                  Revenue and member growth over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalyticsData.revenue.monthly.map((item, index) => (
                    <div
                      key={item.month} className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium">{item.month}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                          ${item.revenue.toLocaleString()}
                        </span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${(item.revenue / 50000) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Revenue (Last 30 Days)</CardTitle>
                <CardDescription>Daily revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockAnalyticsData.revenue.daily
                    .slice(-7)
                    .map((item, index) => (
                      <div
                        key={index} className="flex items-center justify-between"
                      >
                        <span className="text-sm">Day {item.day}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            ${item.revenue}
                          </span>
                          <div className="w-16 bg-gray-200 rounded-full h-1">
                            <div className="bg-green-600 h-1 rounded-full"
                              style={{
                                width: `${(item.revenue / 3000) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
                <CardDescription>
                  Member demographics by age group
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalyticsData.members.ageDistribution.map(
                    (item, index) => (
                      <div
                        key={item.age} className="flex items-center justify-between"
                      >
                        <span className="text-sm font-medium">{item.age}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">
                            {item.count} members
                          </span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-12 text-right">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Membership Types</CardTitle>
                <CardDescription>
                  Distribution of membership plans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalyticsData.members.membershipTypes.map(
                    (item, index) => (
                      <div
                        key={item.type} className="flex items-center justify-between"
                      >
                        <span className="text-sm font-medium">{item.type}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">
                            {item.count} members
                          </span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-orange-600 h-2 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-12 text-right">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Attendance</CardTitle>
                <CardDescription>Check-ins by day of the week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalyticsData.attendance.weekly.map((item, index) => (
                    <div
                      key={item.day} className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium">{item.day}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                          {item.checkIns} check-ins
                        </span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${(item.checkIns / 250) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Peak Hours</CardTitle>
                <CardDescription>Check-ins by hour of the day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {mockAnalyticsData.attendance.hourly
                    .slice(6, 22)
                    .map((item, index) => (
                      <div key={item.hour} className="text-center">
                        <div className="text-xs text-gray-600 mb-1">
                          {item.hour}:00
                        </div>
                        <div className="w-full bg-gray-200 rounded h-16 flex items-end">
                          <div className="w-full bg-blue-600 rounded-b"
                            style={{ height: `${(item.checkIns / 35) * 100}%` }}
                          />
                        </div>
                        <div className="text-xs mt-1">{item.checkIns}</div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="equipment" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Equipment Usage</CardTitle>
                <CardDescription>
                  Usage rates and maintenance status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalyticsData.equipment.usage.map((item, index) => (
                    <div
                      key={item.name} className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium">{item.name}</span>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant={
                            item.maintenance === "Excellent"
                              ? "default"
                              : item.maintenance === "Good"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {item.maintenance}
                        </Badge>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${item.usage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {item.usage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance Schedule</CardTitle>
                <CardDescription>
                  Upcoming and recent maintenance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAnalyticsData.equipment.maintenance.map(
                    (item, index) => (
                      <div
                        key={item.equipment} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <span className="text-sm font-medium">
                            {item.equipment}
                          </span>
                          <div className="text-xs text-gray-600">
                            Last: {item.lastService} | Next: {item.nextDue}
                          </div>
                        </div>
                        <Badge variant="secondary">{item.status}</Badge>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Raw Data View */}
      {showRawData && (
        <Card>
          <CardHeader>
            <CardTitle>Raw Analytics Data</CardTitle>
            <CardDescription>
              JSON data for debugging and integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100">
              {JSON.stringify(mockAnalyticsData, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
