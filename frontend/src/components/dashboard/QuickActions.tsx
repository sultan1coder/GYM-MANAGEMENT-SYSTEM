import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, HeartOff } from "lucide-react";
import {
  useQuickActions,
  QuickAction,
} from "../providers/QuickActionsProvider";

interface QuickActionsProps {
  actions: QuickAction[];
  onActionClick: (action: QuickAction) => void;
  onFavoriteToggle: (actionId: string) => void;
  showFavorites?: boolean;
  maxActions?: number;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  onActionClick,
  onFavoriteToggle,
  showFavorites = true,
  maxActions = 6,
}) => {
  const { toggleFavorite } = useQuickActions();

  const handleFavoriteToggle = (actionId: string) => {
    toggleFavorite(actionId);
    onFavoriteToggle(actionId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50";
      case "warning":
        return "text-yellow-600 bg-yellow-50";
      case "error":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const displayedActions = actions.slice(0, maxActions);

  if (displayedActions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-gray-500">
            <p>No quick actions available</p>
            <p className="text-sm">
              Actions will appear here based on your role and permissions
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Quick Actions
          {showFavorites && (
            <Badge variant="outline" className="ml-2">
              {actions.filter((a) => a.isFavorite).length} Favorites
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedActions.map((action) => (
            <div
              key={action.id}
              className="group relative p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer bg-white dark:bg-gray-800"
              onClick={() => onActionClick(action)}
            >
              {/* Favorite Toggle */}
              {showFavorites && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavoriteToggle(action.id);
                  }}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {action.isFavorite ? (
                    <Heart className="h-4 w-4 text-red-500 fill-current" />
                  ) : (
                    <HeartOff className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              )}

              {/* Action Icon */}
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/40 transition-colors">
                  {action.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                </div>
              </div>

              {/* Action Details */}
              <div className="space-y-2">
                {/* Status and Priority */}
                <div className="flex items-center gap-2">
                  {action.status && (
                    <Badge
                      variant="outline"
                      className={`text-xs ${getStatusColor(action.status)}`}
                    >
                      {action.status}
                    </Badge>
                  )}
                  {action.priority && (
                    <Badge
                      variant="outline"
                      className={`text-xs ${getPriorityColor(action.priority)}`}
                    >
                      {action.priority}
                    </Badge>
                  )}
                </div>

                {/* Count and Additional Info */}
                {action.count !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Count:</span>
                    <span className="text-sm font-medium">{action.count}</span>
                  </div>
                )}

                {/* Permission Requirement */}
                {action.requiresPermission && (
                  <div className="text-xs text-gray-400 mt-2">
                    Requires: {action.requiresPermission}
                  </div>
                )}
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 border-2 border-transparent rounded-lg group-hover:border-blue-300 transition-colors pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Show More Actions Link */}
        {actions.length > maxActions && (
          <div className="mt-6 text-center">
            <Button variant="outline" size="sm">
              View All Actions ({actions.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickActions;
