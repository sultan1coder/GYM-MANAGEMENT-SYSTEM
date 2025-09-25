import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { toast } from "react-hot-toast";
import {
  Users,
  BarChart3,
  FileText,
  Database,
  Activity,
  Shield,
  Download,
  Upload,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Calendar,
  UserCheck,
  Dumbbell,
  CreditCard,
  PieChart,
  LineChart,
  BarChart,
} from "lucide-react";

// Types and Interfaces
interface MemberAnalytics {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  newMembersThisMonth: number;
  membershipsExpiring: number;
  averageAge: number;
  genderDistribution: {
    male: number;
    female: number;
    other: number;
  };
  membershipTypes: {
    monthly: number;
    daily: number;
  };
  topMembershipPlans: Array<{
    name: string;
    count: number;
    revenue: number;
  }>;
  monthlyGrowth: number[];
  revenueByMonth: number[];
  growthRate: number;
}

interface SystemHealth {
  cpu: number;
  memory: number;
  storage: number;
  network: number;
  database: number;
  overallStatus: "healthy" | "warning" | "critical";
  uptime: string;
  lastBackup: string;
  alerts: Array<{
    id: string;
    type: "info" | "warning" | "error";
    message: string;
    timestamp: string;
  }>;
}

interface ReportType {
  id: string;
  label: string;
  description: string;
  category: string;
}

interface BackupType {
  id: string;
  label: string;
  description: string;
  estimatedTime: string;
  size: string;
}

interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

const AdministrativeFeatures: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState("analytics");
  const [selectedReport, setSelectedReport] = useState("members");
  const [reportDateRange, setReportDateRange] = useState("month");
  const [backupType, setBackupType] = useState("full");
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  });

  // Mock data (replace with real API calls)
  const [memberAnalytics, setMemberAnalytics] = useState<MemberAnalytics>({
    totalMembers: 1247,
    activeMembers: 1189,
    inactiveMembers: 58,
    newMembersThisMonth: 89,
    membershipsExpiring: 23,
    averageAge: 34.2,
    genderDistribution: { male: 678, female: 543, other: 26 },
    membershipTypes: { monthly: 892, daily: 297 },
    topMembershipPlans: [
      { name: "Premium Monthly", count: 456, revenue: 45600 },
      { name: "Standard Monthly", count: 436, revenue: 32700 },
      { name: "Daily Pass", count: 297, revenue: 14850 },
    ],
    monthlyGrowth: [0, 5, 12, 8, 15, 22, 18, 25, 30, 28, 35, 42],
    revenueByMonth: [
      45000, 47250, 52920, 57154, 65727, 80187, 94621, 118276, 153759, 196809,
      265691, 377281,
    ],
    growthRate: 42,
  });

  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    cpu: 23,
    memory: 67,
    storage: 45,
    network: 89,
    database: 12,
    overallStatus: "healthy",
    uptime: "15d 8h 32m",
    lastBackup: "2024-01-15 02:00:00",
    alerts: [
      {
        id: "1",
        type: "info",
        message: "Daily backup completed successfully",
        timestamp: "2024-01-15 02:00:00",
      },
      {
        id: "2",
        type: "warning",
        message: "Storage usage approaching 80%",
        timestamp: "2024-01-15 01:30:00",
      },
    ],
  });

  // Report types
  const reportTypes: ReportType[] = [
    {
      id: "members",
      label: "Member Report",
      description: "Comprehensive member analysis",
      category: "Members",
    },
    {
      id: "revenue",
      label: "Revenue Report",
      description: "Financial performance analysis",
      category: "Finance",
    },
    {
      id: "equipment",
      label: "Equipment Report",
      description: "Equipment usage and maintenance",
      category: "Operations",
    },
    {
      id: "attendance",
      label: "Attendance Report",
      description: "Member attendance patterns",
      category: "Members",
    },
    {
      id: "payments",
      label: "Payment Report",
      description: "Payment processing and status",
      category: "Finance",
    },
    {
      id: "system",
      label: "System Report",
      description: "System performance and health",
      category: "System",
    },
  ];

  // Backup types
  const backupTypes: BackupType[] = [
    {
      id: "full",
      label: "Full System Backup",
      description: "Complete system backup including all data",
      estimatedTime: "15-20 min",
      size: "2.4 GB",
    },
    {
      id: "incremental",
      label: "Incremental Backup",
      description: "Only changed data since last backup",
      estimatedTime: "5-10 min",
      size: "156 MB",
    },
    {
      id: "members",
      label: "Members Only",
      description: "Member data and profiles backup",
      estimatedTime: "8-12 min",
      size: "890 MB",
    },
    {
      id: "financial",
      label: "Financial Data",
      description: "Payment and revenue data backup",
      estimatedTime: "3-5 min",
      size: "234 MB",
    },
  ];

  // Available permissions
  const availablePermissions = [
    "members.view",
    "members.create",
    "members.edit",
    "members.delete",
    "payments.view",
    "payments.create",
    "payments.edit",
    "payments.delete",
    "equipment.view",
    "equipment.create",
    "equipment.edit",
    "equipment.delete",
    "reports.view",
    "reports.create",
    "reports.export",
    "users.view",
    "users.create",
    "users.edit",
    "users.delete",
    "system.settings",
    "system.backup",
    "system.restore",
    "analytics.view",
    "analytics.export",
  ];

  // User roles
  const [userRoles, setUserRoles] = useState<UserRole[]>([
    {
      id: "1",
      name: "Administrator",
      description: "Full system access with all permissions",
      permissions: availablePermissions,
      userCount: 3,
    },
    {
      id: "2",
      name: "Staff Manager",
      description: "Member, equipment, and payment management",
      permissions: [
        "members.view",
        "members.create",
        "members.edit",
        "members.delete",
        "payments.view",
        "payments.create",
        "payments.edit",
        "payments.delete",
        "equipment.view",
        "equipment.create",
        "equipment.edit",
        "equipment.delete",
        "reports.view",
        "reports.create",
        "reports.export",
        "analytics.view",
      ],
      userCount: 8,
    },
    {
      id: "3",
      name: "Receptionist",
      description: "Member and payment management",
      permissions: [
        "members.view",
        "members.create",
        "members.edit",
        "payments.view",
        "payments.create",
        "payments.edit",
        "reports.view",
      ],
      userCount: 12,
    },
    {
      id: "4",
      name: "Trainer",
      description: "Member management only",
      permissions: ["members.view", "members.edit", "reports.view"],
      userCount: 15,
    },
  ]);

  // Event handlers
  const handleGenerateReport = () => {
    toast.success(
      `${
        reportTypes.find((r) => r.id === selectedReport)?.label
      } generated successfully!`
    );
  };

  const handleBackup = async () => {
    setIsBackingUp(true);
    // Simulate backup process
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsBackingUp(false);
    toast.success(
      `${
        backupTypes.find((b) => b.id === backupType)?.label
      } completed successfully!`
    );
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    // Simulate restore process
    await new Promise((resolve) => setTimeout(resolve, 5000));
    setIsRestoring(false);
    toast.success("System restored successfully!");
  };

  const handleCreateRole = () => {
    if (!newRole.name.trim()) {
      toast.error("Role name is required");
      return;
    }
    if (newRole.permissions.length === 0) {
      toast.error("At least one permission is required");
      return;
    }

    const role: UserRole = {
      id: Date.now().toString(),
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions,
      userCount: 0,
    };

    setUserRoles([...userRoles, role]);
    setNewRole({ name: "", description: "", permissions: [] });
    setShowCreateRole(false);
    toast.success("Role created successfully!");
  };

  const handlePermissionToggle = (permission: string) => {
    setNewRole((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  // Update system health periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth((prev) => ({
        ...prev,
        cpu: Math.floor(Math.random() * 40) + 10,
        memory: Math.floor(Math.random() * 30) + 50,
        storage: Math.floor(Math.random() * 20) + 40,
        network: Math.floor(Math.random() * 20) + 80,
        database: Math.floor(Math.random() * 15) + 8,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Administrative Features
          </h2>
          <p className="text-gray-600">
            Comprehensive system administration and management tools
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab} className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Backup
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Permissions
          </TabsTrigger>
        </TabsList>

        {/* Member Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
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
                  {memberAnalytics.totalMembers.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{memberAnalytics.growthRate}% from last month
                </p>
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
                  {memberAnalytics.activeMembers.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {(
                    (memberAnalytics.activeMembers /
                      memberAnalytics.totalMembers) *
                    100
                  ).toFixed(1)}
                  % of total
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
                  {memberAnalytics.newMembersThisMonth}
                </div>
                <p className="text-xs text-muted-foreground">
                  {memberAnalytics.membershipsExpiring} expiring soon
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
                  $
                  {memberAnalytics.revenueByMonth[
                    memberAnalytics.revenueByMonth.length - 1
                  ]?.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Average: $
                  {Math.round(
                    memberAnalytics.revenueByMonth.reduce((a, b) => a + b, 0) /
                      memberAnalytics.revenueByMonth.length
                  ).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Membership Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Monthly Memberships
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {memberAnalytics.membershipTypes.monthly} members
                    </span>
                  </div>
                  <Progress
                    value={
                      (memberAnalytics.membershipTypes.monthly /
                        memberAnalytics.totalMembers) *
                      100
                    }
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Daily Passes</span>
                    <span className="text-sm text-muted-foreground">
                      {memberAnalytics.membershipTypes.daily} members
                    </span>
                  </div>
                  <Progress
                    value={
                      (memberAnalytics.membershipTypes.daily /
                        memberAnalytics.totalMembers) *
                      100
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Membership Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {memberAnalytics.topMembershipPlans.map((plan, index) => (
                    <div
                      key={index} className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium">{plan.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {plan.count} members
                        </p>
                      </div>
                      <span className="text-sm font-bold">
                        ${plan.revenue.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Report Generation Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Custom Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="report-type">Report Type</Label>
                    <Select
                      value={selectedReport}
                      onValueChange={setSelectedReport}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        {reportTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-sm text-muted-foreground">
                                {type.description}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="date-range">Date Range</Label>
                    <Select
                      value={reportDateRange}
                      onValueChange={setReportDateRange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="quarter">This Quarter</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleGenerateReport} className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Available Report Types</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {reportTypes.map((type) => (
                      <div
                        key={type.id} className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{type.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {type.description}
                          </p>
                        </div>
                        <Badge variant="secondary">{type.category}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup & Restore Tab */}
        <TabsContent value="backup" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Create System Backup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="backup-type">Backup Type</Label>
                  <Select value={backupType} onValueChange={setBackupType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select backup type" />
                    </SelectTrigger>
                    <SelectContent>
                      {backupTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-sm text-muted-foreground">
                              {type.description} • {type.estimatedTime} •{" "}
                              {type.size}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleBackup}
                  disabled={isBackingUp} className="w-full"
                >
                  {isBackingUp ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Creating Backup...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Start Backup
                    </>
                  )}
                </Button>

                <div className="text-sm text-muted-foreground">
                  <p>Last backup: {systemHealth.lastBackup}</p>
                  <p>
                    Estimated time:{" "}
                    {
                      backupTypes.find((b) => b.id === backupType)
                        ?.estimatedTime
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Restore System</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="backup-file">Select Backup File</Label>
                  <Input
                    id="backup-file"
                    type="file"
                    accept=".backup,.zip,.tar.gz"
                    placeholder="Choose backup file to restore"
                  />
                </div>

                <Button
                  onClick={handleRestore}
                  disabled={isRestoring}
                  variant="destructive" className="w-full"
                >
                  {isRestoring ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Restoring System...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Restore System
                    </>
                  )}
                </Button>

                <div className="text-sm text-muted-foreground">
                  <p className="text-red-600 font-medium">
                    ⚠️ Warning: This will overwrite current system data
                  </p>
                  <p>Make sure to backup current data before proceeding</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemHealth.cpu}%</div>
                <Progress value={systemHealth.cpu} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {systemHealth.cpu > 80
                    ? "High usage detected"
                    : "Normal operation"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Memory Usage
                </CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemHealth.memory}%</div>
                <Progress value={systemHealth.memory} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {systemHealth.memory > 85
                    ? "Memory pressure detected"
                    : "Adequate memory"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Storage Usage
                </CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {systemHealth.storage}%
                </div>
                <Progress value={systemHealth.storage} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {systemHealth.storage > 80
                    ? "Storage space low"
                    : "Sufficient storage"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  System Status
                </CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <Badge
                    variant={
                      systemHealth.overallStatus === "healthy"
                        ? "default"
                        : systemHealth.overallStatus === "warning"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {systemHealth.overallStatus}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Uptime: {systemHealth.uptime}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemHealth.alerts.map((alert) => (
                  <div
                    key={alert.id} className={`flex items-center justify-between p-3 rounded-lg border ${
                      alert.type === "error"
                        ? "border-red-200 bg-red-50"
                        : alert.type === "warning"
                        ? "border-yellow-200 bg-yellow-50"
                        : "border-blue-200 bg-blue-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {alert.type === "error" ? (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      ) : alert.type === "warning" ? (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      )}
                      <span className="text-sm">{alert.message}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {alert.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Permissions Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">User Roles & Permissions</h3>
            <Button onClick={() => setShowCreateRole(true)}>
              <Shield className="h-4 w-4 mr-2" />
              Create New Role
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Existing Roles</h4>
              {userRoles.map((role) => (
                <Card key={role.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{role.name}</CardTitle>
                      <Badge variant="secondary">{role.userCount} users</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {role.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 5).map((permission) => (
                        <Badge
                          key={permission}
                          variant="outline" className="text-xs"
                        >
                          {permission}
                        </Badge>
                      ))}
                      {role.permissions.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {showCreateRole && (
              <Card>
                <CardHeader>
                  <CardTitle>Create New Role</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="role-name">Role Name</Label>
                    <Input
                      id="role-name"
                      value={newRole.name}
                      onChange={(e) =>
                        setNewRole({ ...newRole, name: e.target.value })
                      }
                      placeholder="Enter role name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="role-description">Description</Label>
                    <Input
                      id="role-description"
                      value={newRole.description}
                      onChange={(e) =>
                        setNewRole({ ...newRole, description: e.target.value })
                      }
                      placeholder="Enter role description"
                    />
                  </div>

                  <div>
                    <Label>Permissions</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto">
                      {availablePermissions.map((permission) => (
                        <div
                          key={permission} className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={permission}
                            checked={newRole.permissions.includes(permission)}
                            onCheckedChange={() =>
                              handlePermissionToggle(permission)
                            }
                          />
                          <Label htmlFor={permission} className="text-sm">
                            {permission}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleCreateRole} className="flex-1">
                      Create Role
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateRole(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdministrativeFeatures;
