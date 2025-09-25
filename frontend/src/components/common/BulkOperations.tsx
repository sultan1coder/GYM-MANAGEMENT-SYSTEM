import React, { useState, useEffect } from "react";
import {
  Trash2,
  Edit,
  Download,
  Mail,
  CheckSquare,
  Square,
  MoreHorizontal,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface BulkAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  requiresConfirmation?: boolean;
  confirmationTitle?: string;
  confirmationMessage?: string;
  execute: (selectedIds: string[]) => Promise<void>;
}

interface BulkOperationsProps<T> {
  data: T[];
  selectedItems: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  getItemId: (item: T) => string;
  getItemName: (item: T) => string;
  actions: BulkAction[];
  className?: string;
  showSelectAll?: boolean;
  maxSelections?: number;
}

function BulkOperations<T>({
  data,
  selectedItems,
  onSelectionChange,
  getItemId,
  getItemName,
  actions,
  className,
  showSelectAll = true,
  maxSelections,
}: BulkOperationsProps<T>) {
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [isSelectAllIndeterminate, setIsSelectAllIndeterminate] =
    useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<BulkAction | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [customMessage, setCustomMessage] = useState("");

  // Update select all state when selection changes
  useEffect(() => {
    const totalItems = data.length;
    const selectedCount = selectedItems.length;

    if (selectedCount === 0) {
      setIsSelectAllChecked(false);
      setIsSelectAllIndeterminate(false);
    } else if (selectedCount === totalItems) {
      setIsSelectAllChecked(true);
      setIsSelectAllIndeterminate(false);
    } else {
      setIsSelectAllChecked(false);
      setIsSelectAllIndeterminate(true);
    }
  }, [selectedItems, data.length]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = data.map(getItemId);
      onSelectionChange(allIds);
    } else {
      onSelectionChange([]);
    }
  };

  const handleItemSelect = (itemId: string, checked: boolean) => {
    if (checked) {
      if (maxSelections && selectedItems.length >= maxSelections) {
        return; // Don't add more items if max reached
      }
      onSelectionChange([...selectedItems, itemId]);
    } else {
      onSelectionChange(selectedItems.filter((id) => id !== itemId));
    }
  };

  const handleActionClick = (action: BulkAction) => {
    if (action.requiresConfirmation) {
      setPendingAction(action);
      setShowConfirmation(true);
    } else {
      executeAction(action);
    }
  };

  const executeAction = async (action: BulkAction) => {
    if (selectedItems.length === 0) return;

    setIsExecuting(true);
    try {
      await action.execute(selectedItems);
      // Clear selection after successful action
      onSelectionChange([]);
    } catch (error) {
      console.error("Bulk action failed:", error);
    } finally {
      setIsExecuting(false);
      setShowConfirmation(false);
      setPendingAction(null);
    }
  };

  const handleConfirmAction = () => {
    if (pendingAction) {
      executeAction(pendingAction);
    }
  };

  const selectedCount = selectedItems.length;
  const hasSelection = selectedCount > 0;

  if (data.length === 0) {
    return null;
  }

  return (
    <>
      <div className={cn(
          "flex items-center justify-between p-4 bg-gray-50",
          className
        )}
      >
        <div className="flex items-center gap-4">
          {showSelectAll && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={isSelectAllChecked}
                onCheckedChange={handleSelectAll}
                ref={(el) => {
                  if (el) {
                    el.indeterminate = isSelectAllIndeterminate;
                  }
                }}
              />
              <Label htmlFor="select-all" className="text-sm font-medium">
                Select All
              </Label>
            </div>
          )}

          {hasSelection && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="px-2 py-1">
                {selectedCount} selected
              </Badge>
              {maxSelections && (
                <span className="text-xs text-gray-500">
                  Max: {maxSelections}
                </span>
              )}
            </div>
          )}
        </div>

        {hasSelection && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Bulk Actions:</span>
            <div className="flex items-center gap-1">
              {actions.slice(0, 3).map((action) => (
                <Button
                  key={action.id}
                  variant={action.variant || "outline"}
                  size="sm"
                  onClick={() => handleActionClick(action)}
                  disabled={isExecuting} className="h-8"
                >
                  {action.icon}
                  <span className="ml-1">{action.label}</span>
                </Button>
              ))}

              {actions.length > 3 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>More Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {actions.slice(3).map((action) => (
                      <DropdownMenuItem
                        key={action.id}
                        onClick={() => handleActionClick(action)} className={cn(
                          action.variant === "destructive" && "text-red-600"
                        )}
                      >
                        {action.icon}
                        <span className="ml-2">{action.label}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              {pendingAction?.confirmationTitle || "Confirm Action"}
            </DialogTitle>
            <DialogDescription>
              {pendingAction?.confirmationMessage ||
                `Are you sure you want to perform this action on ${selectedCount} selected items?`}
            </DialogDescription>
          </DialogHeader>

          {(pendingAction?.id === "email" ||
            pendingAction?.id === "message") && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="custom-message">
                  Custom Message (Optional)
                </Label>
                <Textarea
                  id="custom-message"
                  placeholder="Enter your message..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)} className="mt-1"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              disabled={isExecuting}
            >
              Cancel
            </Button>
            <Button
              variant={pendingAction?.variant || "default"}
              onClick={handleConfirmAction}
              disabled={isExecuting}
            >
              {isExecuting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Executing...
                </>
              ) : (
                <>
                  {pendingAction?.icon}
                  <span className="ml-2">Confirm</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Individual row selection component
export const RowSelector: React.FC<{
  itemId: string;
  isSelected: boolean;
  onSelect: (itemId: string, checked: boolean) => void;
  disabled?: boolean;
}> = ({ itemId, isSelected, onSelect, disabled = false }) => {
  return (
    <Checkbox
      checked={isSelected}
      onCheckedChange={(checked) => onSelect(itemId, checked as boolean)}
      disabled={disabled} className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
    />
  );
};

// Bulk operations hook for easy integration
export const useBulkOperations = <T,>(
  data: T[],
  getItemId: (item: T) => string,
  getItemName: (item: T) => string
) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const clearSelection = () => setSelectedItems([]);

  const selectAll = () => {
    setSelectedItems(data.map(getItemId));
  };

  const selectNone = () => {
    setSelectedItems([]);
  };

  const toggleItem = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isSelected = (itemId: string) => selectedItems.includes(itemId);

  const selectedData = data.filter((item) =>
    selectedItems.includes(getItemId(item))
  );

  return {
    selectedItems,
    selectedData,
    setSelectedItems,
    clearSelection,
    selectAll,
    selectNone,
    toggleItem,
    isSelected,
  };
};

export default BulkOperations;
