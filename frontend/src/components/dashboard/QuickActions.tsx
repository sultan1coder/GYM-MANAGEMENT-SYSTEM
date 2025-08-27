import React, { useState } from "react";
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
  Filter,
  Grid3X3,
  List,
  Star,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: "users" | "equipment" | "payments" | "members" | "system";
  action: () => void;
  status?: "active" | "warning" | "error";
  count?: number;
  priority?: "high" | "medium" | "low";
  isFavorite?: boolean;
}

interface QuickActionsProps {
  actions: QuickAction[];
  onActionClick: (action: QuickAction) => void;
  onFavoriteToggle?: (actionId: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  onActionClick,
  onFavoriteToggle,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "priority" | "category">(
    "name"
  );

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
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
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
    const cat = categories.find((c) => c.id === category);
    return cat ? cat.color : "bg-gray-100 text-gray-800";
  };

  const filteredActions = actions
    .filter((action) => {
      const matchesSearch =
        action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        action.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        action.category.includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || action.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title.localeCompare(b.title);
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (
            (priorityOrder[b.priority || "low"] || 0) -
            (priorityOrder[a.priority || "low"] || 0)
          );
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  const handleFavoriteToggle = (actionId: string) => {
    if (onFavoriteToggle) {
      onFavoriteToggle(actionId);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Access all management functions quickly
            </CardDescription>
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
              placeholder="Search actions..."
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

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="priority">Sort by Priority</option>
              <option value="category">Sort by Category</option>
            </select>

            {(searchQuery || selectedCategory !== "all") && (
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
        {filteredActions.length === 0 ? (
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No actions found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear all filters
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
            {filteredActions.map((action) => (
              <div
                key={action.id}
                className={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer group ${
                  viewMode === "list" ? "flex items-center space-x-4" : ""
                }`}
                onClick={() => onActionClick(action)}
              >
                <div
                  className={`flex items-start space-x-3 ${
                    viewMode === "list" ? "flex-1" : ""
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg group-hover:scale-110 transition-transform ${
                      action.category === "users"
                        ? "bg-blue-100 dark:bg-blue-900/20"
                        : action.category === "equipment"
                        ? "bg-green-100 dark:bg-green-900/20"
                        : action.category === "payments"
                        ? "bg-purple-100 dark:bg-purple-900/20"
                        : action.category === "members"
                        ? "bg-orange-100 dark:bg-orange-900/20"
                        : "bg-red-100 dark:bg-red-900/20"
                    }`}
                  >
                    {action.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {action.description}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 ml-2">
                        {action.isFavorite && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                        {onFavoriteToggle && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFavoriteToggle(action.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                action.isFavorite
                                  ? "text-yellow-500 fill-current"
                                  : "text-gray-400"
                              }`}
                            />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-2">
                      {action.status && (
                        <Badge
                          className={`text-xs ${getStatusColor(action.status)}`}
                        >
                          {action.status}
                        </Badge>
                      )}

                      {action.priority && (
                        <Badge
                          className={`text-xs ${getPriorityColor(
                            action.priority
                          )}`}
                        >
                          {action.priority}
                        </Badge>
                      )}

                      <Badge
                        variant="outline"
                        className={`text-xs ${getCategoryColor(
                          action.category
                        )}`}
                      >
                        {action.category}
                      </Badge>

                      {action.count && (
                        <Badge variant="secondary" className="text-xs">
                          {action.count}
                        </Badge>
                      )}
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
              Showing {filteredActions.length} of {actions.length} actions
            </span>
            <span>
              {searchQuery && `Search: "${searchQuery}"`}
              {selectedCategory !== "all" &&
                ` • Category: ${
                  categories.find((c) => c.id === selectedCategory)?.name
                }`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
