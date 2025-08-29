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
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  const { toggleFavorite } = useQuickActions();

  const handleActionClick = (action: QuickAction) => {
    // Navigate to the action path
    window.location.href = action.path;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.slice(0, 6).map((action) => (
          <div
            key={action.id}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                {React.createElement(action.icon as any, {
                  className: "h-4 w-4 text-blue-600",
                })}
              </div>
              <div>
                <h4 className="font-medium text-sm">{action.title}</h4>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={action.status === "active" ? "default" : "secondary"}
              >
                {action.status}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFavorite(action.id)}
                className="p-1 h-8 w-8"
              >
                {action.isFavorite ? (
                  <Heart className="h-4 w-4 text-red-500 fill-current" />
                ) : (
                  <HeartOff className="h-4 w-4 text-gray-400" />
                )}
              </Button>
              <Button
                size="sm"
                onClick={() => handleActionClick(action)}
                className="text-xs"
              >
                Action
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default QuickActions;
