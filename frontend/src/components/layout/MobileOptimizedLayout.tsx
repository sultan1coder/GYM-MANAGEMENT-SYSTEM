import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu, X } from "lucide-react";

interface MobileOptimizedLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
  showSidebar?: boolean;
}

const MobileOptimizedLayout: React.FC<MobileOptimizedLayoutProps> = ({
  children,
  sidebar,
  header,
  className,
  showSidebar = true,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
        <div className="container flex h-14 items-center">
          {showSidebar && sidebar && (
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0 w-[300px]">
                <div className="flex items-center justify-between pb-4">
                  <h2 className="text-lg font-semibold">Navigation</h2>
                </div>
                <ScrollArea className="h-[calc(100vh-8rem)]">
                  {sidebar}
                </ScrollArea>
              </SheetContent>
            </Sheet>
          )}

          {/* Mobile Header Content */}
          <div className="flex-1">{header}</div>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        {showSidebar && sidebar && (
          <aside className="hidden lg:block w-64 border-r bg-gray-50/40 dark:bg-gray-900/40">
            <ScrollArea className="h-screen">
              <div className="p-6">{sidebar}</div>
            </ScrollArea>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1">
          {/* Desktop Header */}
          <div className="hidden lg:block sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">{header}</div>
          </div>

          {/* Page Content */}
          <div className="container py-6 lg:py-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MobileOptimizedLayout;
