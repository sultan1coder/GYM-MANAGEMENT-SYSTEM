import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Settings,
  Users,
  Dumbbell,
  CreditCard,
  Calendar,
  BarChart3,
  Zap,
  ArrowRight,
} from "lucide-react";

const NavigationHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const navigationItems = [
    {
      title: "User Management",
      description: "Manage admin and staff accounts",
      icon: Users,
      path: "/admin/users",
      category: "Administration",
      badge: "25 users",
    },
    {
      title: "Member Management",
      description: "Manage gym members and memberships",
      icon: Users,
      path: "/admin/members",
      category: "Members",
      badge: "150+ members",
    },
    {
      title: "Equipment Management",
      description: "Monitor and maintain gym equipment",
      icon: Dumbbell,
      path: "/admin/equipments",
      category: "Operations",
      badge: "45 items",
    },
    {
      title: "Payment Management",
      description: "Handle payments and subscriptions",
      icon: CreditCard,
      path: "/admin/payments",
      category: "Finance",
      badge: "Active",
    },
    {
      title: "Attendance Tracking",
      description: "Monitor member check-ins and activity",
      icon: Calendar,
      path: "/admin/attendance",
      category: "Operations",
      badge: "Real-time",
    },
    {
      title: "Reports & Analytics",
      description: "View detailed reports and insights",
      icon: BarChart3,
      path: "/admin/reports",
      category: "Analytics",
      badge: "Updated",
    },
    {
      title: "System Settings",
      description: "Configure system preferences",
      icon: Settings,
      path: "/admin/settings",
      category: "System",
      badge: "Admin only",
    },
  ];

  const filteredItems = navigationItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNavigate = (path: string) => {
    window.location.href = path;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Quick Navigation
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search navigation items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.path}
              className="group p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleNavigate(item.path)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <item.icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500">{item.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No navigation items found</p>
            <p className="text-sm">Try adjusting your search terms</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NavigationHub;
