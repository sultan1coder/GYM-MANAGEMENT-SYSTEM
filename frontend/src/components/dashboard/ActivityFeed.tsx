import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Activity,
  MoreHorizontal,
  RefreshCw,
  TrendingUp,
  User,
  Users,
  CreditCard,
  Dumbbell,
  Calendar,
} from "lucide-react";

const ActivityFeed: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock activity data - replace with real data from API
  const activities = [
    {
      id: 1,
      type: "member_registration",
      title: "New Member Registration",
      description: "John Doe registered for monthly membership",
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      user: "John Doe",
      status: "completed",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      id: 2,
      type: "payment_received",
      title: "Payment Received",
      description: "Monthly subscription payment from Jane Smith",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      user: "Jane Smith",
      status: "completed",
      icon: CreditCard,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      id: 3,
      type: "equipment_maintenance",
      title: "Equipment Maintenance",
      description: "Treadmill #3 scheduled for maintenance",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      user: "Maintenance Team",
      status: "pending",
      icon: Dumbbell,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      id: 4,
      type: "attendance_peak",
      title: "Attendance Peak",
      description: "Gym reached 85% capacity during evening hours",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      user: "System",
      status: "info",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      id: 5,
      type: "class_scheduled",
      title: "New Class Scheduled",
      description: "Yoga class added to Saturday schedule",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      user: "Fitness Staff",
      status: "completed",
      icon: Calendar,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - timestamp.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return timestamp.toLocaleDateString();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* Activity Icon */}
              <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                {React.createElement(activity.icon, {
                  className: `h-4 w-4 ${activity.color}`,
                })}
              </div>

              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-xs">
                          <User className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-500">
                        {activity.user}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Activities */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <Button variant="outline" className="w-full">
            View All Activities
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
