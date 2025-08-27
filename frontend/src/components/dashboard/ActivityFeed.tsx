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
import {
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  X,
  RefreshCw,
  Filter,
  Eye,
  MoreHorizontal,
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  description: string;
  timestamp: Date;
  category: "users" | "equipment" | "payments" | "members" | "system";
  priority: "low" | "medium" | "high";
  isRead: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

interface ActivityFeedProps {
  activities?: ActivityItem[];
  maxItems?: number;
  showFilters?: boolean;
  onActivityClick?: (activity: ActivityItem) => void;
  onMarkAsRead?: (activityId: string) => void;
  onRefresh?: () => void;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities = [],
  maxItems = 10,
  showFilters = true,
  onActivityClick,
  onMarkAsRead,
  onRefresh,
}) => {
  const [filteredActivities, setFilteredActivities] = useState<ActivityItem[]>(
    []
  );
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock activities data - replace with actual API calls
  const mockActivities: ActivityItem[] = [
    {
      id: "1",
      type: "success",
      title: "New member registered",
      description: "John Doe has successfully registered as a new gym member",
      timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      category: "members",
      priority: "low",
      isRead: false,
      actionUrl: "/members/new",
      metadata: { memberId: "mem_123", memberName: "John Doe" },
    },
    {
      id: "2",
      type: "info",
      title: "Payment received",
      description: "Payment of $50.00 received from member Sarah Wilson",
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      category: "payments",
      priority: "medium",
      isRead: false,
      actionUrl: "/payments/view",
      metadata: {
        amount: 50.0,
        memberId: "mem_456",
        memberName: "Sarah Wilson",
      },
    },
    {
      id: "3",
      type: "warning",
      title: "Equipment maintenance due",
      description: "Treadmill #3 requires scheduled maintenance",
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      category: "equipment",
      priority: "high",
      isRead: true,
      actionUrl: "/equipment/maintenance",
      metadata: { equipmentId: "eq_789", equipmentName: "Treadmill #3" },
    },
    {
      id: "4",
      type: "success",
      title: "User account created",
      description: "New staff account created for Jane Smith",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      category: "users",
      priority: "medium",
      isRead: true,
      actionUrl: "/users/view",
      metadata: { userId: "usr_101", userName: "Jane Smith", role: "staff" },
    },
    {
      id: "5",
      type: "error",
      title: "System backup failed",
      description: "Automated backup process failed at 2:00 AM",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      category: "system",
      priority: "high",
      isRead: false,
      actionUrl: "/system/backup",
      metadata: { backupTime: "2:00 AM", errorCode: "BK_001" },
    },
    {
      id: "6",
      type: "info",
      title: "Membership renewal",
      description: "Monthly membership renewed for 15 members",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      category: "members",
      priority: "low",
      isRead: true,
      actionUrl: "/members/renewals",
      metadata: { renewalCount: 15, totalAmount: 750.0 },
    },
  ];

  useEffect(() => {
    // Use mock data if no activities provided
    const dataToUse = activities.length > 0 ? activities : mockActivities;

    let filtered = dataToUse.filter((activity) => {
      const matchesType =
        selectedType === "all" || activity.type === selectedType;
      const matchesCategory =
        selectedCategory === "all" || activity.category === selectedCategory;
      const matchesReadStatus = !showUnreadOnly || !activity.isRead;

      return matchesType && matchesCategory && matchesReadStatus;
    });

    // Sort by timestamp (newest first) and priority
    filtered.sort((a, b) => {
      // First sort by priority (high > medium > low)
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff =
        (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);

      if (priorityDiff !== 0) return priorityDiff;

      // Then sort by timestamp (newest first)
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

    // Limit items
    filtered = filtered.slice(0, maxItems);

    setFilteredActivities(filtered);
  }, [activities, selectedType, selectedCategory, showUnreadOnly, maxItems]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "error":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      case "error":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "info":
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
      default:
        return "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "users":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "equipment":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "payments":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "members":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "system":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

    return timestamp.toLocaleDateString();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    // Simulate refresh delay
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleMarkAsRead = (activityId: string) => {
    if (onMarkAsRead) {
      onMarkAsRead(activityId);
    }
  };

  const clearFilters = () => {
    setSelectedType("all");
    setSelectedCategory("all");
    setShowUnreadOnly(false);
  };

  const unreadCount = filteredActivities.filter(
    (activity) => !activity.isRead
  ).length;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Recent Activity</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount} new
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Latest system activities and updates
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="flex flex-wrap items-center gap-4 mt-4">
            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="info">Info</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="users">Users</option>
              <option value="equipment">Equipment</option>
              <option value="payments">Payments</option>
              <option value="members">Members</option>
              <option value="system">System</option>
            </select>

            {/* Unread Only Toggle */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showUnreadOnly}
                onChange={(e) => setShowUnreadOnly(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Unread only
              </span>
            </label>

            {/* Clear Filters */}
            {(selectedType !== "all" ||
              selectedCategory !== "all" ||
              showUnreadOnly) && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center space-x-1"
              >
                <X className="w-3 h-3" />
                <span>Clear</span>
              </Button>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent>
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No activities found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {showUnreadOnly
                ? "No unread activities"
                : "Try adjusting your filters"}
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className={`p-4 border rounded-lg transition-all duration-200 cursor-pointer group ${getTypeColor(
                  activity.type
                )} ${!activity.isRead ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => onActivityClick?.(activity)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getTypeIcon(activity.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {activity.description}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 ml-2">
                        {!activity.isRead && (
                          <Badge variant="secondary" className="text-xs">
                            New
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(activity.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-2">
                      <Badge
                        className={`text-xs ${getPriorityColor(
                          activity.priority
                        )}`}
                      >
                        {activity.priority}
                      </Badge>

                      <Badge
                        variant="outline"
                        className={`text-xs ${getCategoryColor(
                          activity.category
                        )}`}
                      >
                        {activity.category}
                      </Badge>

                      <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimestamp(activity.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Activity Summary */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              Showing {filteredActivities.length} of {mockActivities.length}{" "}
              activities
            </span>
            <span>
              {unreadCount > 0 && `${unreadCount} unread`}
              {selectedType !== "all" && ` • Type: ${selectedType}`}
              {selectedCategory !== "all" && ` • Category: ${selectedCategory}`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
