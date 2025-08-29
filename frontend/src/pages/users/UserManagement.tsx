import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import {
  Search,
  Plus,
  Download,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
} from "lucide-react";
import { updateUserStatus, searchUsers, userAPI } from "@/services/api";
import { useUserGetAll } from "@/hooks/user";

interface SearchFilters {
  searchTerm: string;
  role: string;
  status: string;
  department: string;
  dateRange: {
    start: string;
    end: string;
  };
  lastLoginRange: {
    start: string;
    end: string;
  };
}

interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersThisMonth: number;
  newUsersLastMonth: number;
  userGrowthRate: number;
  roleDistribution: {
    admin: number;
    staff: number;
  };
  activityMetrics: {
    highActivity: number;
    mediumActivity: number;
    lowActivity: number;
  };
  monthlyGrowth: Array<{
    month: string;
    users: number;
    growth: number;
  }>;
  userEngagement: {
    dailyActive: number;
    weeklyActive: number;
    monthlyActive: number;
  };
  performanceMetrics: {
    avgLoginFrequency: number;
    avgSessionDuration: number;
    taskCompletionRate: number;
  };
}

const UserManagement: React.FC = () => {
  // Basic state
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Search and filters
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    searchTerm: "",
    role: "",
    status: "",
    department: "",
    dateRange: { start: "", end: "" },
    lastLoginRange: { start: "", end: "" },
  });
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

  // Analytics
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(
    null
  );

  const { users, isLoading, error, refetch } = useUserGetAll();

  // Type guard for users
  const typedUsers = (users as any[]) || [];

  // Apply filters whenever users or filters change
  useEffect(() => {
    if (typedUsers.length > 0) {
      const filtered = typedUsers.filter((user: any) => {
        // Search term filter (name, email, username)
        if (searchFilters.searchTerm) {
          const searchLower = searchFilters.searchTerm.toLowerCase();
          const matchesSearch =
            user.name?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower) ||
            user.username?.toLowerCase().includes(searchLower);
          if (!matchesSearch) return false;
        }

        // Role filter
        if (searchFilters.role && user.role !== searchFilters.role) {
          return false;
        }

        // Status filter (using created_at as a proxy for active status)
        if (searchFilters.status) {
          const userStatus = user.created_at ? "active" : "inactive";
          if (userStatus !== searchFilters.status) {
            return false;
          }
        }

        // Department filter (using role as a proxy for department)
        if (
          searchFilters.department &&
          user.role !== searchFilters.department
        ) {
          return false;
        }

        // Date range filter (creation date)
        if (searchFilters.dateRange.start && user.created_at) {
          const userDate = new Date(user.created_at);
          const startDate = new Date(searchFilters.dateRange.start);
          if (userDate < startDate) return false;
        }
        if (searchFilters.dateRange.end && user.created_at) {
          const userDate = new Date(user.created_at);
          const endDate = new Date(searchFilters.dateRange.end);
          if (userDate > endDate) return false;
        }

        return true;
      });

      setFilteredUsers(filtered);
    }
  }, [users, searchFilters]);

  // Search users
  const handleSearch = async () => {
    try {
      const params = {
        searchTerm: searchFilters.searchTerm,
        role: searchFilters.role || undefined,
        status: searchFilters.status || undefined,
        department: searchFilters.department || undefined,
        dateRangeStart: searchFilters.dateRange.start || undefined,
        dateRangeEnd: searchFilters.dateRange.end || undefined,
        page: 1,
        limit: 100,
      };

      // Remove undefined values
      Object.keys(params).forEach((key) => {
        if (params[key as keyof typeof params] === undefined) {
          delete params[key as keyof typeof params];
        }
      });

      const response = await searchUsers(params);
      if (response.isSuccess && response.data) {
        setFilteredUsers(response.data.users);
        toast.success(`Found ${response.data.users.length} users`);
      }
    } catch (error) {
      toast.error("Search failed. Using local filtering instead.");
      // Fallback to local filtering
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchFilters({
      searchTerm: "",
      role: "",
      status: "",
      department: "",
      dateRange: { start: "", end: "" },
      lastLoginRange: { start: "", end: "" },
    });
    setFilteredUsers(typedUsers);
  };

  // User action handlers
  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditingUser(user);
    setIsEditing(true);
  };

  const handleDeleteUser = async (user: any) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        const response = await userAPI.deleteUser(user.id);
        if (response.data.isSuccess) {
          toast.success(`User ${user.name} deleted successfully!`);
          refetch();
        } else {
          toast.error(response.data.message || "Failed to delete user");
        }
      } catch (error) {
        toast.error("Failed to delete user");
        console.error("Delete user error:", error);
      }
    }
  };

  const handleUserStatusToggle = async (user: any) => {
    try {
      const isActive = !user.created_at; // Toggle based on current status
      const response = await updateUserStatus(user.id, isActive);
      if (response.isSuccess) {
        toast.success(
          `User ${user.name} ${
            isActive ? "activated" : "deactivated"
          } successfully!`
        );
        refetch();
      } else {
        toast.error(response.message || "Failed to update user status");
      }
    } catch (error) {
      toast.error("Failed to update user status");
      console.error("Status update error:", error);
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchFilters.searchTerm) count++;
    if (searchFilters.role) count++;
    if (searchFilters.status) count++;
    if (searchFilters.department) count++;
    if (searchFilters.dateRange.start || searchFilters.dateRange.end) count++;
    if (searchFilters.lastLoginRange.start || searchFilters.lastLoginRange.end)
      count++;
    return count;
  };

  // Calculate analytics when users change
  useEffect(() => {
    if (typedUsers.length > 0) {
      calculateUserAnalytics();
    }
  }, [typedUsers]);

  // Helper functions for analytics and data
  const calculateUserAnalytics = () => {
    if (!typedUsers.length) return;

    const totalUsers = typedUsers.length;
    const admins = typedUsers.filter(
      (user: any) => user.role === "admin"
    ).length;
    const staff = typedUsers.filter(
      (user: any) => user.role === "staff"
    ).length;
    const activeUsers = typedUsers.filter(
      (user: any) => user.created_at
    ).length;

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const newUsersThisMonth = typedUsers.filter(
      (user: any) => user.created_at && new Date(user.created_at) >= thisMonth
    ).length;

    const newUsersLastMonth = typedUsers.filter(
      (user: any) =>
        user.created_at &&
        new Date(user.created_at) >= lastMonth &&
        new Date(user.created_at) < thisMonth
    ).length;

    const userGrowthRate =
      newUsersLastMonth > 0
        ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100
        : 0;

    const analytics: UserAnalytics = {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      newUsersThisMonth,
      newUsersLastMonth,
      userGrowthRate,
      roleDistribution: { admin: admins, staff },
      activityMetrics: {
        highActivity: Math.floor(totalUsers * 0.3),
        mediumActivity: Math.floor(totalUsers * 0.5),
        lowActivity: Math.floor(totalUsers * 0.2),
      },
      monthlyGrowth: [
        { month: "Jan", users: Math.floor(totalUsers * 0.8), growth: 0 },
        { month: "Feb", users: Math.floor(totalUsers * 0.85), growth: 6.25 },
        { month: "Mar", users: Math.floor(totalUsers * 0.9), growth: 5.88 },
        { month: "Apr", users: Math.floor(totalUsers * 0.92), growth: 2.22 },
        { month: "May", users: Math.floor(totalUsers * 0.95), growth: 3.26 },
        { month: "Jun", users: totalUsers, growth: 5.26 },
      ],
      userEngagement: {
        dailyActive: Math.floor(totalUsers * 0.7),
        weeklyActive: Math.floor(totalUsers * 0.9),
        monthlyActive: totalUsers,
      },
      performanceMetrics: {
        avgLoginFrequency: 2.5,
        avgSessionDuration: 45,
        taskCompletionRate: 87.5,
      },
    };

    setUserAnalytics(analytics);
  };

  // Export users to CSV
  const exportToCSV = () => {
    if (!filteredUsers.length) {
      toast.error("No users to export");
      return;
    }

    const headers = [
      "Name",
      "Email",
      "Username",
      "Phone",
      "Role",
      "Status",
      "Created At",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredUsers.map((user) =>
        [
          `"${user.name || ""}"`,
          `"${user.email || ""}"`,
          `"${user.username || ""}"`,
          `"${user.phone_number || ""}"`,
          `"${user.role || ""}"`,
          `"${user.created_at ? "active" : "inactive"}"`,
          `"${
            user.created_at
              ? new Date(user.created_at).toLocaleDateString()
              : ""
          }"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success(`Exported ${filteredUsers.length} users to CSV`);
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-red-600">
            Error loading users
          </h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <Button onClick={refetch} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              User Management
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage staff and admin users
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={exportToCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => setShowCreateUser(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        {userAnalytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userAnalytics.totalUsers}
                </div>
                <p className="text-xs text-muted-foreground">
                  {userAnalytics.userGrowthRate > 0 ? "+" : ""}
                  {userAnalytics.userGrowthRate.toFixed(1)}% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Users
                </CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userAnalytics.activeUsers}
                </div>
                <p className="text-xs text-muted-foreground">
                  {(
                    (userAnalytics.activeUsers / userAnalytics.totalUsers) *
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
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userAnalytics.newUsersThisMonth}
                </div>
                <p className="text-xs text-muted-foreground">
                  {userAnalytics.newUsersLastMonth} last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Role Distribution
                </CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userAnalytics.roleDistribution.admin} Admin,{" "}
                  {userAnalytics.roleDistribution.staff} Staff
                </div>
                <p className="text-xs text-muted-foreground">
                  {(
                    (userAnalytics.roleDistribution.admin /
                      userAnalytics.totalUsers) *
                    100
                  ).toFixed(1)}
                  % Admin
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search users..."
                    value={searchFilters.searchTerm}
                    onChange={(e) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        searchTerm: e.target.value,
                      }))
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={searchFilters.role}
                  onChange={(e) =>
                    setSearchFilters((prev) => ({
                      ...prev,
                      role: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={searchFilters.status}
                  onChange={(e) =>
                    setSearchFilters((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-end gap-2">
                <Button onClick={handleSearch} className="flex-1">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                {getActiveFiltersCount() > 0 && (
                  <Button onClick={clearFilters} variant="outline">
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Users ({filteredUsers.length} of {typedUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                        <span className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email}
                        </span>
                        {user.phone_number && (
                          <span className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {user.phone_number}
                          </span>
                        )}
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {user.created_at
                            ? new Date(user.created_at).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                    >
                      {user.role}
                    </Badge>
                    <Badge variant={user.created_at ? "default" : "secondary"}>
                      {user.created_at ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUserStatusToggle(user)}
                    >
                      {user.created_at ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteUser(user)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    No users found
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Try adjusting your search criteria or add a new user.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;
