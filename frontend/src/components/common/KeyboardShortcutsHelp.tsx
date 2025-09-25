import React, { useState } from "react";
import { Keyboard, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { cn } from "@/lib/utils";

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({
  isOpen,
  onClose,
}) => {
  const { shortcuts, getShortcutsByCategory } = useKeyboardShortcuts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Shortcuts", count: shortcuts.length },
    {
      id: "Navigation",
      name: "Navigation",
      count: getShortcutsByCategory("Navigation").length,
    },
    {
      id: "Actions",
      name: "Actions",
      count: getShortcutsByCategory("Actions").length,
    },
    { id: "Data", name: "Data", count: getShortcutsByCategory("Data").length },
    { id: "UI", name: "UI", count: getShortcutsByCategory("UI").length },
    {
      id: "System",
      name: "System",
      count: getShortcutsByCategory("System").length,
    },
  ];

  const filteredShortcuts = shortcuts.filter((shortcut) => {
    const matchesSearch =
      searchQuery === "" ||
      shortcut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shortcut.key.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || shortcut.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const formatKeyCombo = (shortcut: any) => {
    const parts = [];
    if (shortcut.ctrlKey) parts.push("Ctrl");
    if (shortcut.altKey) parts.push("Alt");
    if (shortcut.shiftKey) parts.push("Shift");
    if (shortcut.metaKey) parts.push("Cmd");
    parts.push(shortcut.key);
    return parts.join(" + ");
  };

  const getKeyComboColor = (shortcut: any) => {
    const keyCount =
      [
        shortcut.ctrlKey,
        shortcut.altKey,
        shortcut.shiftKey,
        shortcut.metaKey,
      ].filter(Boolean).length + 1;
    if (keyCount === 1) return "bg-gray-100 text-gray-800";
    if (keyCount === 2) return "bg-blue-100 text-blue-800";
    if (keyCount === 3) return "bg-purple-100 text-purple-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search shortcuts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} className="pl-10"
            />
          </div>

          {/* Categories */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-6">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id} className="text-xs"
                >
                  {category.name}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-4">
              <div className="max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {filteredShortcuts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Keyboard className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>No shortcuts found</p>
                      {searchQuery && (
                        <p className="text-sm mt-1">
                          Try adjusting your search
                        </p>
                      )}
                    </div>
                  ) : (
                    filteredShortcuts.map((shortcut, index) => (
                      <Card
                        key={index} className="hover:shadow-sm transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">
                                {shortcut.description}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {shortcut.category}
                              </p>
                            </div>
                            <Badge
                              variant="outline" className={cn(
                                "font-mono text-xs",
                                getKeyComboColor(shortcut)
                              )}
                            >
                              {formatKeyCombo(shortcut)}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Quick Tips */}
          <Card className="bg-blue-50">
            <CardContent className="p-4">
              <h4 className="font-medium text-sm mb-2">💡 Quick Tips</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>
                  • Press{" "}
                  <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">
                    Ctrl + ?
                  </kbd>{" "}
                  to open this help anytime
                </li>
                <li>
                  • Use{" "}
                  <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">
                    Ctrl + F
                  </kbd>{" "}
                  to focus the search bar
                </li>
                <li>
                  • Press{" "}
                  <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">
                    Esc
                  </kbd>{" "}
                  to close modals and dropdowns
                </li>
                <li>
                  • Use{" "}
                  <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">
                    Ctrl + D
                  </kbd>{" "}
                  to toggle dark mode
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsHelp;
