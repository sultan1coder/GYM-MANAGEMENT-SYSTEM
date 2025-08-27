import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Star,
  Clock,
  Grid3X3,
  List,
  Plus,
  Settings,
  Users,
  Dumbbell,
  CreditCard,
  UserCheck,
  Database,
  Zap,
  ArrowRight,
  Bookmark,
  History,
  Home,
  BarChart3,
  FileText,
  Calendar,
  Mail,
  Bell,
  Shield,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

interface NavigationItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category:
    | "users"
    | "equipment"
    | "payments"
    | "members"
    | "system"
    | "reports"
    | "communications";
  path: string;
  isFavorite: boolean;
  isRecent: boolean;
  accessCount: number;
  lastAccessed?: Date;
  status?: "active" | "maintenance" | "new";
  permissions?: string[];
}

interface NavigationHubProps {
  onNavigate: (path: string) => void;
  showFavorites?: boolean;
  showRecent?: boolean;
  showQuickAccess?: boolean;
}

const NavigationHub: React.FC<NavigationHubProps> = ({
  onNavigate,
  showFavorites = true,
  showRecent = true,
  showQuickAccess = true,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Mock navigation data - replace with actual data
  const navigationItems: NavigationItem[] = [
    // User Management
    {
      id: "user-management",
      title: "User Management",
      description: "Manage admin and staff accounts",
      icon: <Users className="w-6 h-6" />,
      category: "users",
      path: "/admin/users",
      isFavorite: true,
      isRecent: true,
      accessCount: 45,
      lastAccessed: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "active",
      permissions: ["admin", "user_manage"],
    },
    {
      id: "user-roles",
      title: "User Roles & Permissions",
      description: "Configure user roles and access levels",
      icon: <Shield className="w-6 h-6" />,
      category: "users",
      path: "/admin/roles",
      isFavorite: false,
      isRecent: false,
      accessCount: 12,
      lastAccessed: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: "active",
      permissions: ["admin"],
    },

    // Equipment Management
    {
      id: "equipment-overview",
      title: "Equipment Overview",
      description: "Monitor and manage gym equipment",
      icon: <Dumbbell className="w-6 h-6" />,
      category: "equipment",
      path: "/admin/equipment",
      isFavorite: true,
      isRecent: true,
      accessCount: 67,
      lastAccessed: new Date(Date.now() - 1 * 60 * 60 * 1000),
      status: "active",
      permissions: ["admin", "equipment_manage"],
    },
    {
      id: "maintenance-schedule",
      title: "Maintenance Schedule",
      description: "Schedule and track equipment maintenance",
      icon: <Calendar className="w-6 h-6" />,
      category: "equipment",
      path: "/admin/maintenance",
      isFavorite: false,
      isRecent: true,
      accessCount: 23,
      lastAccessed: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: "active",
      permissions: ["admin", "equipment_manage"],
    },

    // Payment Management
    {
      id: "payment-dashboard",
      title: "Payment Dashboard",
      description: "Overview of all payment operations",
      icon: <CreditCard className="w-6 h-6" />,
      category: "payments",
      path: "/admin/payments",
      isFavorite: true,
      isRecent: true,
      accessCount: 89,
      lastAccessed: new Date(Date.now() - 30 * 60 * 1000),
      status: "active",
      permissions: ["admin", "payment_manage"],
    },
    {
      id: "payment-reports",
      title: "Payment Reports",
      description: "Generate financial reports and analytics",
      icon: <BarChart3 className="w-6 h-6" />,
      category: "payments",
      path: "/admin/payments/reports",
      isFavorite: false,
      isRecent: false,
      accessCount: 34,
      lastAccessed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: "active",
      permissions: ["admin", "payment_view"],
    },

    // Member Management
    {
      id: "member-overview",
      title: "Member Overview",
      description: "Manage gym members and memberships",
      icon: <UserCheck className="w-6 h-6" />,
      category: "members",
      path: "/admin/members",
      isFavorite: true,
      isRecent: true,
      accessCount: 156,
      lastAccessed: new Date(Date.now() - 15 * 60 * 1000),
      status: "active",
      permissions: ["admin", "member_manage"],
    },
    {
      id: "membership-plans",
      title: "Membership Plans",
      description: "Configure membership packages and pricing",
      icon: <FileText className="w-6 h-6" />,
      category: "members",
      path: "/admin/memberships",
      isFavorite: false,
      isRecent: false,
      accessCount: 18,
      lastAccessed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: "active",
      permissions: ["admin"],
    },

    // System Management
    {
      id: "system-settings",
      title: "System Settings",
      description: "Configure gym system preferences",
      icon: <Settings className="w-6 h-6" />,
      category: "system",
      path: "/admin/settings",
      isFavorite: false,
      isRecent: false,
      accessCount: 8,
      lastAccessed: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      status: "active",
      permissions: ["admin"],
    },
    {
      id: "system-health",
      title: "System Health",
      description: "Monitor system performance and status",
      icon: <Zap className="w-6 h-6" />,
      category: "system",
      path: "/admin/health",
      isFavorite: true,
      isRecent: false,
      accessCount: 42,
      lastAccessed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: "active",
      permissions: ["admin"],
    },

    // Reports & Analytics
    {
      id: "analytics-dashboard",
      title: "Analytics Dashboard",
      description: "Comprehensive gym performance analytics",
      icon: <BarChart3 className="w-6 h-6" />,
      category: "reports",
      path: "/admin/analytics",
      isFavorite: true,
      isRecent: true,
      accessCount: 78,
      lastAccessed: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: "active",
      permissions: ["admin", "analytics_view"],
    },
    {
      id: "custom-reports",
      title: "Custom Reports",
      description: "Create and schedule custom reports",
      icon: <FileText className="w-6 h-6" />,
      category: "reports",
      path: "/admin/reports",
      isFavorite: false,
      isRecent: false,
      accessCount: 15,
      lastAccessed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: "active",
      permissions: ["admin", "reports_create"],
    },

    // Communications
    {
      id: "member-communications",
      title: "Member Communications",
      description: "Send notifications and messages to members",
      icon: <Mail className="w-6 h-6" />,
      category: "communications",
      path: "/admin/communications",
      isFavorite: false,
      isRecent: false,
      accessCount: 29,
      lastAccessed: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      status: "active",
      permissions: ["admin", "communications_send"],
    },
    {
      id: "notification-center",
      title: "Notification Center",
      description: "Manage system notifications and alerts",
      icon: <Bell className="w-6 h-6" />,
      category: "communications",
      path: "/admin/notifications",
      isFavorite: false,
      isRecent: false,
      accessCount: 21,
      lastAccessed: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      status: "active",
      permissions: ["admin"],
    },
  ];

  const categories = [
    { id: "all", name: "All", color: "bg-gray-100 text-gray-800" },
    { id: "users", name: "Users", color: "bg-blue-100 text-blue-800" },
    {
      id: "equipment",
      name: "Equipment",
      color: "bg-green-100 text-green-800",
    },
    {
      id: "payments",
      name: "Payments",
      color: "bg-purple-100 text-purple-800",
    },
    { id: "members", name: "Members", color: "bg-orange-100 text-orange-800" },
    { id: "system", name: "System", color: "bg-red-100 text-red-800" },
    { id: "reports", name: "Reports", color: "bg-indigo-100 text-indigo-800" },
    {
      id: "communications",
      name: "Communications",
      color: "bg-pink-100 text-pink-800",
    },
  ];

  const getCategoryColor = (category: string) => {
    const cat = categories.find((c) => c.id === category);
    return cat ? cat.color : "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "new":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const filteredItems = navigationItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesFavorites = !showOnlyFavorites || item.isFavorite;

    return matchesSearch && matchesCategory && matchesFavorites;
  });

  const favoriteItems = navigationItems.filter((item) => item.isFavorite);
  const recentItems = navigationItems
    .filter((item) => item.isRecent)
    .slice(0, 6);

  const handleFavoriteToggle = (itemId: string) => {
    // In real implementation, this would update the backend
    console.log("Toggle favorite for:", itemId);
  };

  const handleNavigate = (path: string) => {
    onNavigate(path);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setShowOnlyFavorites(false);
  };

  return (
    <div className="space-y-6">
      {/* Quick Access Section */}
      {showQuickAccess && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Quick Access</span>
            </CardTitle>
            <CardDescription>Most frequently used functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {favoriteItems.slice(0, 4).map((item) => (
                <Button
                  key={item.id}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 p-2"
                  onClick={() => handleNavigate(item.path)}
                >
                  <div className="text-blue-600">{item.icon}</div>
                  <span className="text-xs text-center font-medium">
                    {item.title}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Access Section */}
      {showRecent && recentItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Recently Accessed</span>
            </CardTitle>
            <CardDescription>Functions you've used recently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  onClick={() => handleNavigate(item.path)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {item.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {item.lastAccessed?.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Navigation Hub */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Grid3X3 className="w-5 h-5" />
                <span>Navigation Hub</span>
              </CardTitle>
              <CardDescription>Access all management functions</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search functions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {showFavorites && (
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showOnlyFavorites}
                    onChange={(e) => setShowOnlyFavorites(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Favorites only
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === category.id
                    ? category.color
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          {filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No functions found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear filters
              </Button>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-3"
              }
            >
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer group ${
                    viewMode === "list" ? "flex items-center space-x-4" : ""
                  }`}
                  onClick={() => handleNavigate(item.path)}
                >
                  <div
                    className={`flex items-start space-x-3 ${
                      viewMode === "list" ? "flex-1" : ""
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg group-hover:scale-110 transition-transform ${
                        item.category === "users"
                          ? "bg-blue-100 dark:bg-blue-900/20"
                          : item.category === "equipment"
                          ? "bg-green-100 dark:bg-green-900/20"
                          : item.category === "payments"
                          ? "bg-purple-100 dark:bg-purple-900/20"
                          : item.category === "members"
                          ? "bg-orange-100 dark:bg-orange-900/20"
                          : item.category === "system"
                          ? "bg-red-100 dark:bg-red-900/20"
                          : item.category === "reports"
                          ? "bg-indigo-100 dark:bg-indigo-900/20"
                          : "bg-pink-100 dark:bg-pink-900/20"
                      }`}
                    >
                      {item.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 ml-2">
                          {item.isFavorite && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFavoriteToggle(item.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                item.isFavorite
                                  ? "text-yellow-500 fill-current"
                                  : "text-gray-400"
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mt-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${getCategoryColor(
                            item.category
                          )}`}
                        >
                          {item.category}
                        </Badge>

                        {item.status && (
                          <Badge
                            className={`text-xs ${getStatusColor(item.status)}`}
                          >
                            {item.status}
                          </Badge>
                        )}

                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <span>Access: {item.accessCount}</span>
                          {item.lastAccessed && (
                            <>
                              <span>•</span>
                              <span>
                                {item.lastAccessed.toLocaleDateString()}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results Summary */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>
                Showing {filteredItems.length} of {navigationItems.length}{" "}
                functions
              </span>
              <span>
                {favoriteItems.length} favorites
                {searchQuery && ` • Search: "${searchQuery}"`}
                {selectedCategory !== "all" &&
                  ` • Category: ${
                    categories.find((c) => c.id === selectedCategory)?.name
                  }`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NavigationHub;
